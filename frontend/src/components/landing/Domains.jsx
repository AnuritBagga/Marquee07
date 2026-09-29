import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const DOMAINS = [
  "DSA & Algorithms",
  "System Design",
  "Frontend",
  "Backend",
  "Machine Learning",
  "Mechanical",
  "Electrical",
  "UPSC Personality Test",
  "NDA / CDS",
  "Banking PO",
  "Product Management",
  "Behavioral",
  "Custom JD",
];

const Row = ({ items, direction = "left", speed = 38 }) => (
  <div className="flex whitespace-nowrap select-none">
    <div
      className="animate-marquee flex"
      style={{
        animationDirection: direction === "right" ? "reverse" : "normal",
        animationDuration: `${speed}s`,
      }}
    >
      {[...items, ...items].map((d, i) => (
        <span
          key={i}
          className="font-serif italic text-white/15 hover:text-[#D4AF37] transition-colors duration-700 text-5xl sm:text-7xl md:text-9xl tracking-tight px-6 sm:px-10"
        >
          {d}
          <span className="not-italic text-[#D4AF37]/40 mx-4 sm:mx-8 align-middle text-2xl sm:text-4xl">
            ✦
          </span>
        </span>
      ))}
    </div>
  </div>
);

export const Domains = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section
      ref={ref}
      id="domains"
      data-testid="domains-section"
      className="relative py-20 sm:py-28 md:py-40 overflow-hidden border-y border-white/5"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 mb-12 sm:mb-16 md:mb-24 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-4 sm:mb-6">
            04 — Domains
          </p>
          <h2 className="font-serif font-light text-white text-4xl sm:text-5xl md:text-7xl leading-[0.92] tracking-tight max-w-3xl">
            From algorithms to{" "}
            <span className="italic text-white/70">UPSC.</span>
          </h2>
        </div>
        <p className="text-white/55 text-sm sm:text-base md:text-lg max-w-sm leading-relaxed">
          Thirty domains. One disciplined examiner. Pick yours — or feed it the
          job description and watch it improvise.
        </p>
      </div>

      <motion.div style={{ x: x1 }} className="space-y-3">
        <Row items={DOMAINS} speed={50} />
      </motion.div>
      <motion.div style={{ x: x2 }} className="mt-2 opacity-70">
        <Row items={[...DOMAINS].reverse()} direction="right" speed={62} />
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {[
          { k: "30+", v: "Domains covered" },
          { k: "1.4s", v: "Avg follow-up latency" },
          { k: "94%", v: "Recruiter alignment" },
          { k: "0", v: "Two interviews alike" },
        ].map((s, i) => (
          <div
            key={i}
            data-testid={`stat-${i}`}
            className="hairline p-4 sm:p-6 md:p-8 hover:border-[#D4AF37]/40 transition-colors duration-500"
          >
            <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              {s.k}
            </p>
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40 mt-2 sm:mt-3">
              {s.v}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Domains;
