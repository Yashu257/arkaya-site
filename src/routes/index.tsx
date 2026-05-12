import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CursorOrb } from "@/components/CursorOrb";
import { HeroScene } from "@/components/HeroScene";
import { ServiceCard } from "@/components/ServiceCard";
import { CaseStudyGrid } from "@/components/CaseStudyScene";
import { TeamNetwork } from "@/components/TeamNetwork";
import { ContactScene } from "@/components/ContactScene";
import svcAi from "@/assets/svc-ai-agent.jpg";
import svcWeb from "@/assets/svc-web.jpg";
import svcMobile from "@/assets/svc-mobile.jpg";
import svcAuto from "@/assets/svc-automation.jpg";
import projNimbus from "@/assets/proj-nimbus.jpg";
import projHelix from "@/assets/proj-helix.jpg";
import projVault from "@/assets/proj-vault.jpg";
import projAtlas from "@/assets/proj-atlas.jpg";
import projMonolith from "@/assets/proj-monolith.jpg";
import projPulse from "@/assets/proj-pulse.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Arkaya — We Build Things People Remember" },
      {
        name: "description",
        content:
          "Arkaya is a creative digital agency crafting AI agents, custom websites, mobile APKs, and automation tools.",
      },
      { property: "og:title", content: "Arkaya — Creative Digital Agency" },
      {
        property: "og:description",
        content: "AI Agents · Web · Mobile APKs · Automation Tools.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;600&family=Inter:wght@300;400;600;700&display=swap",
      },
    ],
  }),
});

function useScrollProgress() {
  const ref = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return ref;
}

function HeroHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      ref.current.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div ref={ref} className="transition-transform duration-100 ease-out will-change-transform w-full px-2">
      <h1
        className="font-display text-[clamp(2.4rem,10vw,11rem)] leading-[0.88] font-bold text-center"
        style={{
          background: "linear-gradient(180deg, #fff 0%, #fff 40%, color-mix(in oklab, var(--ember) 80%, #fff) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 60px color-mix(in oklab, var(--ember) 40%, transparent)",
          filter: "drop-shadow(0 8px 30px rgba(232,76,30,0.3))",
        }}
      >
        We Build Things
        <br />
        <span className="text-ember" style={{ WebkitTextFillColor: "var(--ember)" }}>
          People Remember
        </span>
      </h1>
    </div>
  );
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Mounted({ children }: { children: React.ReactNode }) {
  const [m, setM] = useState(false);
  useIsomorphicLayoutEffect(() => { setM(true); }, []);
  if (!m) return null;
  return <>{children}</>;
}

// Mobile hamburger nav
function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 z-50"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>
      {open && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center gap-10 md:hidden">
          {["services", "work", "team", "contact"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              onClick={() => setOpen(false)}
              className="font-display text-5xl tracking-widest hover:text-ember transition"
            >
              {s.toUpperCase()}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function Index() {
  const scrollRef = useScrollProgress();

  return (
    <div className="relative bg-background text-foreground overflow-x-hidden">
      <Mounted>
        <CursorOrb />
      </Mounted>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 md:px-8 py-4 md:py-6 flex justify-between items-center mix-blend-difference">
        <div className="font-display text-xl md:text-2xl tracking-widest">ARKAYA</div>
        {/* Desktop links */}
        <div className="hidden md:flex gap-10 label-mono">
          <a data-orb-hover href="#services" className="hover:text-ember transition">Services</a>
          <a data-orb-hover href="#work" className="hover:text-ember transition">Work</a>
          <a data-orb-hover href="#team" className="hover:text-ember transition">Team</a>
          <a data-orb-hover href="#contact" className="hover:text-ember transition">Contact</a>
        </div>
        {/* Mobile hamburger */}
        <MobileNav />
      </nav>

      {/* HERO — use 100dvh so mobile browser chrome doesn't cause overflow */}
      <section className="relative h-[100dvh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 canvas-fade-in">
          <Mounted>
            <HeroScene scrollRef={scrollRef} />
          </Mounted>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6">
          <div className="label-mono text-ember mb-4 md:mb-8 animate-pulse-glow hero-fade-in text-center">
            // arkaya — creative digital studio
          </div>
          <div className="hero-fade-in-delay-1 w-full">
            <HeroHeadline />
          </div>
          <div className="mt-6 md:mt-10 label-mono text-foreground/80 text-glow-ember text-center hero-fade-in-delay-2 flex flex-wrap justify-center gap-x-2 gap-y-1">
            <span className="text-ember">AI Agents</span>
            <span className="text-muted-foreground">·</span>
            <span>Web</span>
            <span className="text-muted-foreground">·</span>
            <span>Mobile APKs</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-emerald-glow">Automation Tools</span>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 label-mono text-muted-foreground animate-pulse-glow hero-fade-in-delay-2 whitespace-nowrap">
            scroll to enter ↓
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background" />
      </section>

      {/* SERVICES */}
      <section id="services" className="relative py-16 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-10 md:mb-20">
          <div className="label-mono text-ember mb-3 md:mb-4">// 01 — what we build</div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-none">
            Services that<br />
            <span className="text-ember text-glow-ember">live in the future.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <ServiceCard image={svcAi} icon="◈" title="AI Agent Development" desc="Autonomous agents that think, act, and integrate across your stack — built on the latest LLM frameworks." accent="#e84c1e" />
          <ServiceCard image={svcWeb} icon="▣" title="Website Design & Dev" desc="Cinematic, conversion-optimized websites with motion, 3D, and ruthless attention to detail." accent="#2a6a4a" />
          <ServiceCard image={svcMobile} icon="◐" title="Mobile APK Development" desc="Native-feel Android APKs and cross-platform mobile experiences shipped fast and beautifully." accent="#e84c1e" />
          <ServiceCard image={svcAuto} icon="⚙" title="AI Tools & Automation" desc="Internal tools, workflow automations, and custom AI products that compress hours into seconds." accent="#2a6a4a" />
        </div>
      </section>

      {/* CASE STUDIES */}
      <section id="work" className="relative py-16 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-10 md:mb-20">
          <div className="label-mono text-ember mb-3 md:mb-4">// 02 — selected work</div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-none">
            Projects that<br />
            <span className="text-ember text-glow-ember">left a mark.</span>
          </h2>
        </div>
        <CaseStudyGrid cards={[
            { kind: "phone", screen: projNimbus, tag: "// mobile · ai", title: "Nimbus AI Companion", desc: "A pocket-sized AI agent for daily planning, deployed as a cross-platform APK with on-device intent routing." },
            { kind: "laptop", screen: projHelix, tag: "// web · saas", title: "Helix Workflow Engine", desc: "A no-code automation builder used by ops teams to ship integrations 12× faster." },
            { kind: "phone", screen: projVault, tag: "// mobile · fintech", title: "Vault Mobile", desc: "Encrypted personal finance APK with biometric vaults and AI-driven spend coaching." },
            { kind: "laptop", screen: projAtlas, tag: "// web · agent", title: "Atlas Sales Copilot", desc: "A B2B sales agent that researches, drafts, and books — integrated with HubSpot and Slack." },
            { kind: "laptop", screen: projMonolith, tag: "// web · brand", title: "Monolith Studio", desc: "A cinematic portfolio for an architecture firm with three.js scroll-driven scenes." },
            { kind: "phone", screen: projPulse, tag: "// mobile · health", title: "Pulse Coach", desc: "An AI personal trainer APK that adapts workouts in real time using on-device sensor fusion." },
          ]} />
      </section>

      {/* TEAM */}
      <section id="team" className="relative py-16 md:py-32 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto mb-8 md:mb-12">
          <div className="label-mono text-ember mb-3 md:mb-4">// 03 — the makers</div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-none">
            Small team.<br />
            <span className="text-ember text-glow-ember">Outsized output.</span>
          </h2>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <TeamNetwork
            members={[
              { name: "Yashwanth", role: "Founder · Full Stack AI Engineer", initials: "YA" },
              { name: "Prabhu Teja", role: "AI Engineer", initials: "PT" },
              { name: "Navkesh Marani", role: "AI Engineer", initials: "NM" },
              { name: "Guru Vishnu", role: "AI Engineer", initials: "GV" },
              { name: "Surya", role: "App Developer", initials: "SU" },
            ]}
          />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative min-h-[100dvh] w-full overflow-hidden">
        <div className="absolute inset-0 canvas-fade-in">
          <Mounted>
            <ContactScene />
          </Mounted>
        </div>
        <div className="relative z-10 min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 py-20">
          <div
            className="panel-glass rounded-2xl p-5 sm:p-7 md:p-9 max-w-sm sm:max-w-md w-full animate-float"
            style={{ boxShadow: "0 0 60px color-mix(in oklab, var(--ember) 30%, transparent)" }}
          >
            <div className="label-mono text-ember mb-2">// 04 — start a project</div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-none mb-4 md:mb-5">
              Let's build<br />
              <span className="text-ember text-glow-ember">something unforgettable.</span>
            </h2>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Transmission sent. We'll be in touch.");
              }}
            >
              <div>
                <label htmlFor="contact-name" className="label-mono text-muted-foreground block mb-1">name</label>
                <input
                  id="contact-name"
                  name="name"
                  data-orb-hover
                  required
                  autoComplete="name"
                  className="w-full bg-input/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember transition"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="label-mono text-muted-foreground block mb-1">email</label>
                <input
                  id="contact-email"
                  name="email"
                  data-orb-hover
                  required
                  type="email"
                  autoComplete="email"
                  className="w-full bg-input/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember transition"
                />
              </div>
              <div>
                <label htmlFor="contact-brief" className="label-mono text-muted-foreground block mb-1">project brief</label>
                <textarea
                  id="contact-brief"
                  name="brief"
                  data-orb-hover
                  required
                  rows={3}
                  className="w-full bg-input/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember transition resize-none"
                />
              </div>
              <button
                data-orb-hover
                type="submit"
                className="w-full gradient-ember text-primary-foreground font-display tracking-widest text-base md:text-lg py-3 rounded-lg glow-ember hover:scale-[1.02] transition-transform"
              >
                TRANSMIT →
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border py-8 px-4 text-center label-mono text-muted-foreground text-xs">
        © {new Date().getFullYear()} ARKAYA · BUILT IN THE DARK
      </footer>
    </div>
  );
}
