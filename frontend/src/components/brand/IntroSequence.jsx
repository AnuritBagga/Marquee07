import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lion from "@/components/brand/Lion";

export default function IntroSequence({ onDone }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setOpen(false), 3400);
    const t2 = setTimeout(() => onDone?.(), 3950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          data-testid="brand-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.55, ease: [0.6, 0, 0.4, 1] }}
          className="fixed inset-0 z-[9999] bg-[#020202] flex items-center justify-center overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.10),transparent_60%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.6] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />

          <div className="relative flex flex-col items-center">
            <div className="relative inline-block">
              <motion.h1
                className="font-serif font-light text-white text-7xl md:text-9xl tracking-tight leading-none select-none"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: [14, 14, 0, 6, 0] }}
                transition={{
                  duration: 0.8,
                  times: [0, 0.5, 0.65, 0.85, 1],
                  ease: "easeOut",
                  delay: 1.05,
                }}
              >
                MARQUEE
              </motion.h1>

              <motion.div
                className="absolute left-1/2 -top-24 md:-top-28 z-10 -translate-x-1/2"
                initial={{ y: 340, scale: 0.4, rotate: -18, opacity: 0 }}
                animate={{
                  y: [340, -14, 0, 5, 0],
                  scale: [0.4, 1.04, 1, 1, 1],
                  rotate: [-18, 4, 0, 2, 0],
                  opacity: [0, 1, 1, 1, 1],
                }}
                transition={{
                  duration: 1.07,
                  times: [0, 0.65, 0.93, 0.97, 1],
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.35,
                }}
              >
                <motion.div
                  className="absolute inset-0 -m-6 rounded-full bg-[#D4AF37]/[0.22] blur-2xl"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.95, duration: 0.5 }}
                />
                <motion.span
                  className="absolute left-1/2 bottom-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D4AF37]"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.9, 0], scale: [0, 3.2, 4.5] }}
                  transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
                />
                <Lion size={118} glow={false} testId="intro-lion" />
              </motion.div>
            </div>

            <motion.p
              className="mt-6 font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] text-[#D4AF37]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.75, duration: 0.6 }}
            >
              <span className="inline-block w-6 h-px bg-[#D4AF37] align-middle mr-3" />
              The new standard of interviewing
              <span className="inline-block w-6 h-px bg-[#D4AF37] align-middle ml-3" />
            </motion.p>
          </div>

          <motion.p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.5em] text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            Reel · 00 — Overture
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}