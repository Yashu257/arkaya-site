import { useState } from "react";

export function TeamPortal({
  name,
  role,
  initials,
  index,
  total,
}: {
  name: string;
  role: string;
  initials: string;
  index: number;
  total: number;
}) {
  const [hover, setHover] = useState(false);
  // arrange in arc
  const span = Math.PI * 0.7;
  const angle = -span / 2 + (span * index) / Math.max(total - 1, 1);
  const x = Math.sin(angle) * 320;
  const y = -Math.cos(angle) * 60;
  const z = Math.cos(angle) * 100;

  return (
    <div
      data-orb-hover
      className="absolute left-1/2 top-1/2 transition-all duration-500 ease-out"
      style={{
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${hover ? z + 80 : z}px) scale(${hover ? 1.15 : 1})`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="relative w-32 h-32 rounded-full flex items-center justify-center font-display text-4xl font-bold transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--ember) ${hover ? 80 : 40}%, var(--background)), var(--background))`,
          boxShadow: hover
            ? "0 0 80px var(--ember), 0 0 120px color-mix(in oklab, var(--ember) 50%, transparent), inset 0 0 40px color-mix(in oklab, var(--ember) 60%, transparent)"
            : "0 0 30px color-mix(in oklab, var(--ember) 40%, transparent), inset 0 0 20px color-mix(in oklab, var(--ember) 30%, transparent)",
          border: "1px solid color-mix(in oklab, var(--ember) 60%, transparent)",
        }}
      >
        {initials}
        <div className="absolute -inset-2 rounded-full border border-ember/30 animate-pulse-glow" />
      </div>
      <div className="text-center mt-4">
        <div className="font-bold text-lg leading-tight">{name}</div>
        <div className="label-mono text-ember mt-1">{role}</div>
      </div>
    </div>
  );
}
