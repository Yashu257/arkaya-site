import { useEffect, useRef, useState } from "react";

type Member = { name: string; role: string; initials: string };

type Node = {
  m: Member;
  x: number;
  y: number;
  hub: boolean;
  // drift params
  ax: number;
  ay: number;
  px: number;
  py: number;
};

export function TeamNetwork({ members }: { members: Member[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [size, setSize] = useState({ w: 1000, h: 560 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // measure
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // animation loop for drift
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setTick((t) => (t + 1) % 100000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = size.w / 2;
  const cy = size.h / 2;
  const radius = Math.min(size.w, size.h) * (isMobile ? 0.32 : 0.36);

  // Scale node sizes for mobile
  const hubSize = isMobile ? 80 : 132;
  const nodeSize = isMobile ? 58 : 96;

  // first member is hub, rest distributed evenly
  const others = members.slice(1);
  const baseNodes: Node[] = [
    {
      m: members[0],
      x: cx,
      y: cy,
      hub: true,
      ax: 6,
      ay: 8,
      px: 0.6,
      py: 0.5,
    },
    ...others.map((m, i) => {
      const angle = (i / others.length) * Math.PI * 2 - Math.PI / 2;
      return {
        m,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        hub: false,
        ax: 10 + (i % 3) * 4,
        ay: 12 + (i % 2) * 5,
        px: 0.4 + i * 0.3,
        py: 0.3 + i * 0.25,
      };
    }),
  ];

  const t = tick / 60;
  const nodes = baseNodes.map((n) => ({
    ...n,
    dx: n.x + Math.sin(t * n.px) * n.ax,
    dy: n.y + Math.cos(t * n.py) * n.ay,
  }));

  // edges: every node connects to every other (full mesh)
  const edges: { a: number; b: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push({ a: i, b: j });
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full h-[420px] sm:h-[560px] md:h-[680px]">
      {/* SVG synapses */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="synapse-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="node-grad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffb088" />
            <stop offset="45%" stopColor="#e84c1e" />
            <stop offset="100%" stopColor="#3a0f04" />
          </radialGradient>
          <radialGradient id="hub-grad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffd9b8" />
            <stop offset="40%" stopColor="#ff7a3a" />
            <stop offset="100%" stopColor="#4a1408" />
          </radialGradient>
        </defs>

        {edges.map((e, i) => {
          const a = nodes[e.a];
          const b = nodes[e.b];
          const isActive =
            hovered !== null && (hovered === e.a || hovered === e.b);
          const dim = hovered !== null && !isActive;
          const baseOp = isActive ? 0.9 : dim ? 0.06 : 0.22;
          const width = isActive ? 1.6 : 0.7;

          // pulse traveling along line
          const pulsePhase = (t * 0.6 + i * 0.18) % 1;
          const pulseX = a.dx + (b.dx - a.dx) * pulsePhase;
          const pulseY = a.dy + (b.dy - a.dy) * pulsePhase;

          return (
            <g key={i}>
              <line
                x1={a.dx}
                y1={a.dy}
                x2={b.dx}
                y2={b.dy}
                stroke="#e84c1e"
                strokeOpacity={baseOp}
                strokeWidth={width}
                filter={isActive ? "url(#synapse-glow)" : undefined}
              />
              {(isActive || !dim) && (
                <circle
                  cx={pulseX}
                  cy={pulseY}
                  r={isActive ? 2.6 : 1.6}
                  fill="#ffb088"
                  opacity={isActive ? 0.95 : 0.5}
                  filter="url(#synapse-glow)"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((n, i) => {
        const isHover = hovered === i;
        const dim = hovered !== null && !isHover;
        const sz = n.hub ? hubSize : nodeSize;
        return (
          <div
            key={n.m.initials}
            data-orb-hover
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="absolute transition-[opacity,transform] duration-300 ease-out"
            style={{
              left: n.dx,
              top: n.dy,
              transform: `translate(-50%, -50%) scale(${isHover ? 1.12 : 1})`,
              opacity: dim ? 0.5 : 1,
              zIndex: isHover ? 30 : n.hub ? 20 : 10,
            }}
          >
            <div
              className="relative rounded-full flex items-center justify-center font-display font-bold transition-all duration-300"
              style={{
                width: sz,
                height: sz,
                fontSize: n.hub ? (isMobile ? 22 : 36) : (isMobile ? 16 : 28),
                color: "#fff",
                background: `radial-gradient(circle at 30% 30%, ${
                  n.hub
                    ? "color-mix(in oklab, var(--ember) 90%, #fff)"
                    : "color-mix(in oklab, var(--ember) 70%, #000)"
                }, #1a0a05 75%)`,
                border: `1px solid color-mix(in oklab, var(--ember) ${
                  isHover ? 100 : n.hub ? 80 : 60
                }%, transparent)`,
                boxShadow: isHover
                  ? "0 0 50px var(--ember), 0 0 100px color-mix(in oklab, var(--ember) 60%, transparent), inset 0 0 30px color-mix(in oklab, var(--ember) 70%, transparent)"
                  : n.hub
                    ? "0 0 40px color-mix(in oklab, var(--ember) 70%, transparent), inset 0 0 25px color-mix(in oklab, var(--ember) 50%, transparent)"
                    : "0 0 22px color-mix(in oklab, var(--ember) 45%, transparent), inset 0 0 18px color-mix(in oklab, var(--ember) 35%, transparent)",
              }}
            >
              {n.m.initials}
              <div
                className="absolute rounded-full pointer-events-none animate-pulse-glow"
                style={{
                  inset: -8,
                  border: `1px solid color-mix(in oklab, var(--ember) ${
                    n.hub ? 60 : 35
                  }%, transparent)`,
                }}
              />
              {n.hub && (
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: -18,
                    border: "1px dashed color-mix(in oklab, var(--ember) 30%, transparent)",
                    animation: "spin 22s linear infinite",
                  }}
                />
              )}
            </div>
            <div
              className="text-center mt-4 whitespace-nowrap"
              style={{ transform: "translateX(-50%)", marginLeft: "50%", width: "max-content" }}
            >
              <div
                className="font-bold leading-tight"
                style={{ fontSize: n.hub ? (isMobile ? 12 : 18) : (isMobile ? 10 : 15) }}
              >
                {n.m.name}
              </div>
              <div className="label-mono text-ember mt-1" style={{ fontSize: isMobile ? 8 : 11 }}>
                {n.m.role}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
