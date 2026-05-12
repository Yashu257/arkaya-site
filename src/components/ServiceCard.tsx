import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Float } from "@react-three/drei";
import { ClientOnly } from "./ClientOnly";

function CardMesh({ hovered, accent }: { hovered: boolean; accent: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const target = hovered ? 0.35 : 0;
    ref.current.rotation.y += (Math.sin(state.clock.elapsedTime * 0.6) * 0.2 + target - ref.current.rotation.y) * dt * 2;
    ref.current.rotation.x += (target * 0.4 - ref.current.rotation.x) * dt * 2;
  });
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={ref}>
        <boxGeometry args={[2.4, 3.2, 0.08]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={hovered ? 1.2 : 0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

export function ServiceCard({
  icon,
  title,
  desc,
  image,
  accent = "#e84c1e",
}: {
  icon: string;
  title: string;
  desc: string;
  image: string;
  accent?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      data-orb-hover
      className="group relative h-[460px] panel-glass rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        boxShadow: hovered ? `0 0 60px ${accent}80, inset 0 0 40px ${accent}30` : `0 0 20px ${accent}20`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "scale-110 opacity-90" : "scale-100 opacity-70"}`}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${accent}20 40%, var(--background) 95%)`,
        }}
      />
      <div className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none">
        <ClientOnly>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.3} />
            <pointLight position={[3, 3, 3]} intensity={2} color={accent} />
            <pointLight position={[-3, -2, 2]} intensity={1} color="#1a3a2a" />
            <CardMesh hovered={hovered} accent={accent} />
          </Canvas>
        </ClientOnly>
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between p-7 pointer-events-none">
        <div className="text-5xl text-glow-ember">{icon}</div>
        <div>
          <div className="label-mono text-ember mb-3">// service</div>
          <h3 className="text-3xl font-bold leading-none mb-3">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
