import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const BG =
  "https://images.unsplash.com/photo-1690983320828-c01b88baacb0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGRhcmslMjBsdXh1cnklMjB0ZXh0dXJlJTIwZ3JhaW58ZW58MHx8fHwxNzgxOTUwOTU4fDA&ixlib=rb-4.1.0&q=85";

export const Testimonial = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <section
      ref={ref}
      data-testid="testimonial-section"
      className="relative py-24 sm:py-32 md:py-48 overflow-hidden"
    >
      <motion.div style={{ scale, y }} className="absolute inset-0 z-0">
        <img
          src={BG}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </motion.div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 md:px-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-8 sm:mb-10">
          05 — In Their Words
        </p>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2 }}
          className="font-serif italic font-light text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight"
        >
          &ldquo;Marquee doesn&apos;t just{" "}
          <span className="text-[#D4AF37]">assess code.</span> It assesses
          thought. Our first round has never been this honest.&rdquo;
        </motion.blockquote>

        <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-white/50">
          <span className="hidden sm:block w-12 h-px bg-white/30" />
          <div className="text-center sm:text-left">
            <p className="font-sans text-sm text-white tracking-wide">
              Aishani Bose
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mt-0.5">
              Head of Talent · Northwind Labs
            </p>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 border-t border-white/5 pt-8 sm:pt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30 mb-6 sm:mb-8">
            Quietly trusted by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 md:gap-x-16 gap-y-4 sm:gap-y-6 text-white/40 font-serif text-base sm:text-lg md:text-xl tracking-wide">
            {[
              "NORTHWIND",
              "Helix & Co.",
              "Atlas Dynamics",
              "Quill House",
              "Lumen Yards",
              "Tannhäuser",
            ].map((brand) => (
              <span
                key={brand}
                className="hover:text-white transition-colors duration-500"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
