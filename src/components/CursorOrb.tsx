import { useEffect, useState } from "react";

export function CursorOrb() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement;
      setHovering(!!el?.closest?.("[data-orb-hover], button, a"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed z-[100] rounded-full mix-blend-screen transition-[width,height,background] duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          width: hovering ? 56 : 18,
          height: hovering ? 56 : 18,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, var(--ember) 0%, color-mix(in oklab, var(--ember) 30%, transparent) 50%, transparent 80%)",
          boxShadow: "0 0 40px var(--ember), 0 0 80px color-mix(in oklab, var(--ember) 40%, transparent)",
        }}
      />
      <div
        className="pointer-events-none fixed z-[100] rounded-full bg-foreground"
        style={{
          left: pos.x,
          top: pos.y,
          width: 4,
          height: 4,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
