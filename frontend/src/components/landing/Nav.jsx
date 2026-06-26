import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lion from "@/components/brand/Lion";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Modes", href: "#modes" },
    { label: "Domains", href: "#domains" },
    { label: "Method", href: "#method" },
  ];

  return (
    <nav
      data-testid="primary-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 min-h-[80px] md:h-20 flex items-center justify-between flex-wrap gap-4">
        <a
          href="#top"
          data-testid="nav-logo"
          className="flex items-center gap-3 group"
        >
          <Lion size={32} testId="nav-lion" animate glow />
          <span className="font-serif text-2xl tracking-tight text-white">
            Marquee
          </span>
        </a>

        <div className="hidden md:flex items-center gap-12">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-[13px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-300 whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Link
            to="/company-register"
            className="btn-royal px-3 md:px-5 py-2 md:py-2.5 text-[10px] md:text-[11px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors duration-300 whitespace-nowrap"
          >
            For Companies
          </Link>
          <Link
            to="/university-register"
            className="btn-royal px-3 md:px-5 py-2 md:py-2.5 text-[10px] md:text-[11px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors duration-300 whitespace-nowrap"
          >
            For Universities
          </Link>
          <Link
            to="/practice"
            data-testid="nav-cta-practice"
            className="btn-royal hairline-strong px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-[11px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-colors duration-500 whitespace-nowrap"
          >
            Start Practice
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;