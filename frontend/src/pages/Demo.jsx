import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { DOMAINS } from "@/data/interviewScripts";
import SmoothScroll from "@/components/landing/SmoothScroll";
import Lion from "@/components/brand/Lion";

export default function Demo() {
  return (
    <SmoothScroll>
      <main
        data-testid="demo-page"
        className="relative min-h-screen bg-[#050505] text-white grain"
      >
        {/* Top bar */}
        <header className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
            <Link
              to="/"
              data-testid="demo-back-link"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              <span className="text-[11px] uppercase tracking-[0.3em]">
                Back to Lobby
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Lion size={24} testId="demo-nav-lion" />
              <span className="font-serif text-2xl tracking-tight">
                Marquee
              </span>
            </div>
            <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Stage · Selection
            </span>
          </div>
        </header>

        <section className="pt-40 pb-20 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-8"
            >
              ✦ Choose your room
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="font-serif font-light text-white text-5xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tight max-w-4xl"
            >
              Which kind of interview
              <br />
              <span className="italic text-white/70">do you fear most?</span>
            </motion.h1>
            <p className="mt-10 max-w-xl text-white/55 text-base md:text-lg leading-relaxed">
              Pick a room. Marquee adapts its tone, vocabulary and cadence to
              match the examiner you&apos;d face in real life. No two sessions
              are alike.
            </p>
          </div>
        </section>

        {/* Domain grid */}
        <section className="px-6 md:px-12 pb-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {DOMAINS.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, delay: i * 0.08 }}
              >
                <Link
                  to={`/demo/${d.id}/enter`}
                  data-testid={`domain-card-${d.id}`}
                  className="group relative block overflow-hidden hairline aspect-[16/9] md:aspect-[5/3]"
                >
                  <div className="absolute inset-0">
                    <img
                      src={d.image}
                      alt={d.title}
                      className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/70 group-hover:bg-black/45 transition-colors duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
                        {d.cinematic}
                      </span>
                      <ArrowUpRight
                        size={22}
                        strokeWidth={1.2}
                        className="text-white/40 group-hover:text-[#D4AF37] group-hover:rotate-45 transition-all duration-500"
                      />
                    </div>

                    <div>
                      <h3 className="font-serif text-4xl md:text-5xl text-white tracking-tight leading-[0.95] mb-3">
                        {d.title}
                      </h3>
                      <p className="text-white/65 text-sm md:text-base max-w-md leading-relaxed">
                        {d.blurb}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <span className="hairline px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white/70">
                          {d.tone}
                        </span>
                        <span className="hairline px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white/70">
                          {d.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="max-w-[1400px] mx-auto mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 text-center">
            ✦ This is a scripted preview. Real sessions adapt live to your answers. ✦
          </p>
        </section>
      </main>
    </SmoothScroll>
  );
}
