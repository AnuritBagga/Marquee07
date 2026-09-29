import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Mic, Sparkles, Code2 } from "lucide-react";

export const LiveDemo = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const mockY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={ref}
      id="method"
      data-testid="live-demo-section"
      className="relative py-20 sm:py-28 md:py-40 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-20">
        {/* Sticky text block */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p
              data-testid="method-overline"
              className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6 sm:mb-8"
            >
              02 — Method
            </p>
            <h2 className="font-serif font-light text-white text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight">
              Listens with intent.
              <br />
              <span className="italic text-white/70">Cross-questions</span>
              <br />
              with intelligence.
            </h2>
            <p className="mt-6 sm:mt-10 text-white/55 text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
              Marquee transcribes your voice in real time, evaluates the depth
              of your reasoning, and asks the precise follow-up question a
              senior interviewer would. Not a script. A conversation.
            </p>

            <div className="mt-8 sm:mt-12 space-y-4 sm:space-y-6">
              {[
                {
                  icon: Mic,
                  title: "Real-time transcription",
                  body: "Sub-300ms latency. Every pause, every hesitation, captured.",
                },
                {
                  icon: Sparkles,
                  title: "Adaptive cross-questioning",
                  body: "Each question is born from your last answer. No two interviews alike.",
                },
                {
                  icon: Code2,
                  title: "Code, on the rails",
                  body: "DSA prompts with live editor. The AI reads your code, asks you to defend it.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  data-testid={`method-feature-${i}`}
                  className="flex items-start gap-4 sm:gap-5 group"
                >
                  <div className="hairline w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white/70 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/40 transition-colors duration-500 shrink-0">
                    <f.icon size={16} strokeWidth={1.4} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-white tracking-tight">
                      {f.title}
                    </h3>
                    <p className="text-white/50 text-xs sm:text-sm mt-1 sm:mt-1.5 leading-relaxed max-w-sm">
                      {f.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mockup window */}
        <motion.div
          style={{ y: mockY }}
          className="lg:col-span-7"
        >
          <div
            data-testid="live-demo-mockup"
            className="hairline bg-black/40 backdrop-blur-2xl p-1 sm:p-1.5"
          >
            {/* window chrome */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-white/5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/20" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/20" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/20" />
              </div>
              <span className="hidden sm:inline font-mono text-[10px] text-white/40 uppercase tracking-[0.25em]">
                marquee · session 0341 · live
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-white/40 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 animate-pulse" />
                REC
              </div>
            </div>

            {/* body */}
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* Interviewer line */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <span className="font-mono text-[9px] sm:text-[10px] text-[#D4AF37] uppercase tracking-[0.25em] sm:tracking-[0.3em] sm:pt-1.5 sm:w-24 shrink-0">
                  Interviewer
                </span>
                <p className="font-serif text-xl sm:text-2xl md:text-3xl text-white leading-snug">
                  &ldquo;Walk me through how you&apos;d detect a cycle in a
                  linked list. Then tell me why your approach is the right
                  one.&rdquo;
                </p>
              </div>

              {/* Candidate audio block */}
              <div className="hairline bg-white/[0.02] p-3 sm:p-5">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="font-mono text-[9px] sm:text-[10px] text-white/50 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                    Candidate · speaking
                  </span>
                  <div className="flex items-end gap-[2px] sm:gap-[3px] h-5 sm:h-6">
                    {[0.4, 0.7, 0.5, 0.9, 0.3, 0.8, 0.6, 0.5, 0.7].map(
                      (h, i) => (
                        <span
                          key={i}
                          style={{
                            height: `${h * 100}%`,
                            animationDelay: `${i * 0.08}s`,
                          }}
                          className="audio-bar w-[2px] sm:w-[3px] bg-[#D4AF37]/80"
                        />
                      ),
                    )}
                  </div>
                </div>
                <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
                  &ldquo;I&apos;d use Floyd&apos;s tortoise and hare — two
                  pointers, one moving twice as fast. If they ever meet,
                  there&apos;s a cycle. O(n) time, O(1) space, and it&apos;s
                  proven mathematically...
                  <span className="cursor-blink text-[#D4AF37]">|</span>
                  &rdquo;
                </p>
              </div>

              {/* Code editor mockup */}
              <div className="hairline bg-[#0A0A0A] overflow-hidden">
                <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 border-b border-white/5">
                  <span className="font-mono text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                    solution.py
                  </span>
                  <span className="hidden sm:inline font-mono text-[10px] text-white/40">
                    Python 3.11
                  </span>
                </div>
                <pre className="font-mono text-[10px] sm:text-[12px] md:text-[13px] leading-relaxed p-3 sm:p-5 text-white/80 overflow-x-auto">
                  <span className="text-white/30">1  </span>
                  <span className="text-[#D4AF37]">def</span>{" "}
                  <span className="text-white">has_cycle</span>(head):{"\n"}
                  <span className="text-white/30">2  </span>    slow = fast =
                  head{"\n"}
                  <span className="text-white/30">3  </span>    {" "}
                  <span className="text-[#D4AF37]">while</span> fast{" "}
                  <span className="text-[#D4AF37]">and</span> fast.next:{"\n"}
                  <span className="text-white/30">4  </span>        slow =
                  slow.next{"\n"}
                  <span className="text-white/30">5  </span>        fast =
                  fast.next.next{"\n"}
                  <span className="text-white/30">6  </span>        {" "}
                  <span className="text-[#D4AF37]">if</span> slow == fast:{" "}
                  <span className="text-[#D4AF37]">return</span> True{"\n"}
                  <span className="text-white/30">7  </span>    {" "}
                  <span className="text-[#D4AF37]">return</span> False
                  <span className="cursor-blink text-white">▌</span>
                </pre>
              </div>

              {/* AI follow-up */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9 }}
                className="border-l border-[#D4AF37]/50 pl-3 sm:pl-5 py-1"
              >
                <span className="font-mono text-[9px] sm:text-[10px] text-[#D4AF37] uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                  Marquee · follow-up
                </span>
                <p className="font-serif italic text-white/90 text-base sm:text-lg md:text-xl mt-1.5 sm:mt-2 leading-snug">
                  &ldquo;Interesting. But what happens when the list is
                  empty? And could you prove formally why the pointers must
                  meet?&rdquo;
                </p>
              </motion.div>
            </div>
          </div>

          {/* meta caption */}
          <p className="mt-3 sm:mt-5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/30 text-right">
            — captured from a live session
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveDemo;
