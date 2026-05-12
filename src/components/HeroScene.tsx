import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Sun({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo1 = useRef<THREE.Mesh>(null);
  const halo2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = scrollRef.current;
    if (group.current) {
      group.current.position.y = -0.6 + Math.sin(t * 0.4) * 0.08 + s * 1.2;
      group.current.position.z = -3 - s * 2;
    }
    if (core.current) {
      core.current.rotation.y += 0.003;
      const pulse = 1 + Math.sin(t * 1.5) * 0.03;
      core.current.scale.setScalar(pulse);
    }
    if (halo1.current) halo1.current.rotation.z += 0.001;
    if (halo2.current) halo2.current.rotation.z -= 0.0015;
  });

  return (
    <group ref={group} position={[0, -0.6, -3]}>
      <mesh ref={halo2} scale={3.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff6a1e" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <mesh ref={halo1} scale={2.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff8a3d" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshStandardMaterial
          color="#ff5a14"
          emissive="#ff7a2a"
          emissiveIntensity={2.4}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <pointLight color="#ff6a1e" intensity={4} distance={18} decay={2} />
    </group>
  );
}

function FloatingShape({
  position,
  geometry,
  color,
  wireframe = false,
  scale = 1,
}: {
  position: [number, number, number];
  geometry: "sphere" | "box" | "torus" | "octa";
  color: string;
  wireframe?: boolean;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.002;
    ref.current.rotation.y += 0.003;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.3;
  });
  const geom = useMemo(() => {
    switch (geometry) {
      case "sphere":
        return <sphereGeometry args={[1, 48, 48]} />;
      case "box":
        return <boxGeometry args={[1.2, 1.2, 1.2]} />;
      case "torus":
        return <torusGeometry args={[0.9, 0.3, 24, 64]} />;
      case "octa":
        return <octahedronGeometry args={[1.1, 0]} />;
    }
  }, [geometry]);

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        {geom}
        {wireframe ? (
          <meshBasicMaterial color={color} wireframe />
        ) : (
          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.7}
            emissive={color}
            emissiveIntensity={0.35}
          />
        )}
      </mesh>
    </Float>
  );
}

function CameraRig({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  useFrame((state) => {
    const s = scrollRef.current;
    state.camera.position.z = 8 - s * 6;
    state.camera.position.x = Math.sin(state.mouse.x * 0.5) * 0.8;
    state.camera.position.y = state.mouse.y * 0.4;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, precision: "highp" }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#080808"]} />
      <fog attach="fog" args={["#080808", 8, 28]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#e84c1e" />
      <directionalLight position={[-6, -3, -4]} intensity={0.6} color="#1a3a2a" />
      <pointLight position={[0, 0, 4]} intensity={1.5} color="#e84c1e" distance={20} />

      <Stars radius={60} depth={40} count={3000} factor={3} saturation={0} fade speed={0.6} />

      <Sun scrollRef={scrollRef} />

      <FloatingShape position={[-4, 1.2, -2]} geometry="sphere" color="#e84c1e" scale={1.1} />
      <FloatingShape position={[4.2, -1.2, -3]} geometry="octa" color="#1a3a2a" scale={1.4} />
      <FloatingShape position={[-3.5, -2, -5]} geometry="box" color="#e84c1e" wireframe scale={1.3} />
      <FloatingShape position={[3.8, 2.4, -6]} geometry="torus" color="#2a6a4a" scale={1.0} />
      <FloatingShape position={[0, -3.2, -8]} geometry="sphere" color="#e84c1e" wireframe scale={1.6} />
      <FloatingShape position={[-6, 3, -10]} geometry="octa" color="#e84c1e" wireframe scale={1.2} />
      <FloatingShape position={[6, -2, -12]} geometry="box" color="#1a3a2a" scale={1.5} />
      <FloatingShape position={[1.2, 1.6, -14]} geometry="sphere" color="#e84c1e" scale={0.8} />
      <FloatingShape position={[-2, -1.5, -16]} geometry="torus" color="#2a6a4a" wireframe scale={1.1} />

      <CameraRig scrollRef={scrollRef} />
    </Canvas>
  );
}
