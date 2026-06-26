import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const BG_TEXTURE =
  "https://images.unsplash.com/photo-1528459061998-56fd57ad86e3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGRhcmslMjBsdXh1cnklMjB0ZXh0dXJlJTIwZ3JhaW58ZW58MHx8fHwxNzgxOTUwOTU4fDA&ixlib=rb-4.1.0&q=85";

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Heading moves up faster than bg → parallax
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.85]);
  const subY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={ref}
      id="top"
      data-testid="hero-section"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background layer — slowest */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0"
      >
        <img
          src={BG_TEXTURE}
          alt="texture"
          className="w-full h-[120%] object-cover opacity-[0.35]"
        />
      </motion.div>

      {/* Vignette overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 z-10 pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(5,5,5,0.6)_55%,#050505_95%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
      </motion.div>

      {/* Royal halo behind text */}
      <div className="absolute z-10 w-[640px] h-[640px] rounded-full bg-[#D4AF37]/10 blur-[120px] halo-pulse" />

      {/* Foreground content */}
      <motion.div
        style={{ y: headingY }}
        className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          data-testid="hero-overline"
          className="text-[11px] md:text-xs uppercase tracking-[0.5em] text-white/50 mb-10"
        >
          <span className="inline-block w-8 h-px bg-[#D4AF37] align-middle mr-4" />
          The New Standard
          <span className="inline-block w-8 h-px bg-[#D4AF37] align-middle ml-4" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          data-testid="hero-heading"
          className="font-serif font-light text-white text-[15vw] md:text-[10vw] lg:text-[9rem] leading-[0.88] tracking-[-0.03em]"
        >
          The Interview,
          <br />
          <span className="italic text-[#D4AF37]/95 font-light">
            Reimagined.
          </span>
        </motion.h1>

        <motion.div
          style={{ y: subY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.8 }}
          className="mt-12 max-w-xl mx-auto"
        >
          <p
            data-testid="hero-subtitle"
            className="font-sans text-white/60 text-base md:text-lg leading-relaxed tracking-wide"
          >
            Real-time AI cross-questioning that listens, reasons, and responds
            like a true interviewer. Built for campuses, companies, and the
            quietly ambitious.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14">
            <Link
              to="/practice"
              data-testid="hero-cta-primary"
              className="btn-royal bg-[#D4AF37] text-black px-6 sm:px-8 py-3 sm:py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-colors duration-500 w-full sm:w-auto text-center whitespace-nowrap"
            >
              Start Your Practice
            </Link>
            <a
              href="#method"
              data-testid="hero-cta-secondary"
              className="hairline-strong px-6 sm:px-8 py-3 sm:py-4 text-[11px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-colors duration-500 w-full sm:w-auto text-center whitespace-nowrap"
            >
              See the Method
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-white/40"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.div>

      {/* Side meta labels */}
      <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-2 rotate-180 [writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.4em] text-white/30">
        <span>Marquee · Est. 2026</span>
      </div>
      <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-2 [writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.4em] text-white/30">
        <span>Reel · 01 — Overture</span>
      </div>
    </section>
  );
};

export default Hero;

