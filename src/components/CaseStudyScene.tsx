/**
 * CaseStudyScene — single shared WebGL context for all cards.
 *
 * Previously each CaseStudyCard had its own <Canvas>, creating 6+ WebGL
 * contexts and hitting the browser limit (~8), causing "Context Lost" errors.
 *
 * Now: one <SharedDeviceCanvas> mounts once. On hover/click it teleports to
 * the active card's container via a portal-like absolute-position overlay.
 * All other cards show a static blurred screenshot background.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Float, RoundedBox, useTexture } from "@react-three/drei";

// ─── Device mesh (phone or laptop) ───────────────────────────────────────────

function Device({
  kind,
  flipped,
  screen,
}: {
  kind: "phone" | "laptop";
  flipped: boolean;
  screen: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const tex = useTexture(screen);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = flipped ? Math.PI : 0;
    ref.current.rotation.y += (target - ref.current.rotation.y) * dt * 3;
  });

  if (kind === "phone") {
    return (
      <group ref={ref}>
        <RoundedBox args={[1.4, 2.6, 0.16]} radius={0.18} smoothness={6}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.25} />
        </RoundedBox>
        <mesh position={[0, 0, 0.085]}>
          <planeGeometry args={[1.25, 2.45]} />
          <meshStandardMaterial
            map={tex}
            emissiveMap={tex}
            emissive="#ffffff"
            emissiveIntensity={0.55}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0, -0.085]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.25, 2.45]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={ref}>
      <RoundedBox args={[3, 1.9, 0.12]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[2.85, 1.75]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.07]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.85, 1.75]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.05, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[3.2, 0.8, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

// ─── Active card state shared across all cards ────────────────────────────────

type ActiveCard = {
  kind: "phone" | "laptop";
  screen: string;
  flipped: boolean;
  rect: DOMRect;
};

// ─── Single shared Canvas — renders the active card's device ─────────────────

function SharedDeviceCanvas({ active }: { active: ActiveCard | null }) {
  if (!active) return null;

  const { rect, kind, screen, flipped } = active;

  return (
    <div
      style={{
        position: "fixed",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <Canvas
        camera={{ position: [0, 0.3, 5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ precision: "highp", alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
        events={() => ({ connect: () => {}, disconnect: () => {} })}
      >
        <ambientLight intensity={0.25} />
        <spotLight position={[0, 5, 5]} angle={0.4} penumbra={0.8} intensity={3} color="#ffffff" />
        <pointLight position={[-3, 2, 3]} intensity={1.2} color="#e84c1e" />
        <pointLight position={[3, -2, 2]} intensity={0.8} color="#1a3a2a" />
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
          <Device kind={kind} flipped={flipped} screen={screen} />
        </Float>
      </Canvas>
    </div>
  );
}

// ─── Card grid wrapper — owns the single Canvas ───────────────────────────────

type CardDef = {
  kind: "phone" | "laptop";
  title: string;
  tag: string;
  desc: string;
  screen: string;
};

export function CaseStudyGrid({ cards }: { cards: CardDef[] }) {
  const [active, setActive] = useState<ActiveCard | null>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <CaseStudyCard key={c.title} {...c} onActiveChange={setActive} />
        ))}
      </div>
      <SharedDeviceCanvas active={active} />
    </>
  );
}

// ─── Individual card — no Canvas, just DOM + blurred bg ──────────────────────

function CaseStudyCard({
  kind,
  title,
  tag,
  desc,
  screen,
  onActiveChange,
}: CardDef & { onActiveChange: (a: ActiveCard | null) => void }) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const reportRect = useCallback(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    onActiveChange({ kind, screen, flipped, rect });
  }, [kind, screen, flipped, onActiveChange]);

  // Keep rect fresh on scroll/resize while hovered
  useEffect(() => {
    let raf = 0;
    let active = false;

    const tick = () => {
      if (active) reportRect();
      raf = requestAnimationFrame(tick);
    };

    const start = () => { active = true; raf = requestAnimationFrame(tick); };
    const stop = () => { active = false; cancelAnimationFrame(raf); onActiveChange(null); };

    const el = cardRef.current;
    el?.addEventListener("mouseenter", start);
    el?.addEventListener("mouseleave", stop);
    return () => {
      el?.removeEventListener("mouseenter", start);
      el?.removeEventListener("mouseleave", stop);
      cancelAnimationFrame(raf);
    };
  }, [reportRect, onActiveChange]);

  return (
    <div
      ref={cardRef}
      data-orb-hover
      onClick={() => setFlipped((v) => !v)}
      className="group relative h-[460px] rounded-2xl overflow-hidden panel-glass cursor-none"
    >
      {/* blurred screenshot background — always visible */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${screen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(40px) saturate(1.2)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background/80" />

      {/* static preview image shown when not hovered */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0"
        style={{ pointerEvents: "none" }}
      >
        <img
          src={screen}
          alt={title}
          className="object-contain h-3/4 w-auto rounded-lg opacity-70"
          loading="lazy"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 pointer-events-none bg-gradient-to-t from-background via-background/85 to-transparent">
        <div className="label-mono text-ember mb-2">{tag}</div>
        <h3 className="text-2xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {flipped ? desc : "Click to reveal →"}
        </p>
      </div>
    </div>
  );
}
