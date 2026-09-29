import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MODES = [
  {
    tag: "01",
    title: "For Campuses",
    subtitle: "Placement-grade preparation, at scale.",
    body: "Equip every student with a personal interviewer. Track cohort readiness, assign mock cycles, surface candidates who shine under pressure.",
    image:
      "https://images.unsplash.com/photo-1532170579297-281918c8ae72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwzfHxjaW5lbWF0aWMlMjBjb3Jwb3JhdGUlMjBwb3J0cmFpdCUyMGRhcmt8ZW58MHx8fHwxNzgxOTUwOTU4fDA&ixlib=rb-4.1.0&q=85",
    points: ["Cohort dashboards", "Mock cycles by domain", "Readiness scores"],
    span: "lg:col-span-7 lg:row-span-2",
  },
  {
    tag: "02",
    title: "For Companies",
    subtitle: "First round, done before Monday.",
    body: "Set parameters. Marquee runs Round 1 across hundreds of candidates and returns a shortlist with rationale, transcripts, and depth scores.",
    image:
      "https://images.pexels.com/photos/9200331/pexels-photo-9200331.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    points: [
      "JD-based question synthesis",
      "Auto-shortlist with rationale",
      "Bias-audit transcripts",
    ],
    span: "lg:col-span-5",
  },
  {
    tag: "03",
    title: "For the Self-Taught",
    subtitle: "A private rehearsal hall.",
    body: "Practice alone. Be challenged like a stranger would. Replay your sessions, see exactly where your reasoning slipped.",
    image:
      "https://images.pexels.com/photos/33290983/pexels-photo-33290983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    points: ["Unlimited sessions", "Voice + code review", "Session replays"],
    span: "lg:col-span-5",
  },
];

const Card = ({ mode, i }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (mode.tag === "01") navigate("/campuses");
    else if (mode.tag === "02") navigate("/companies");
    else if (mode.tag === "03") navigate("/practice");
  };
  return (
  <motion.article
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
    data-testid={`mode-card-${i}`}
    onClick={handleClick}
    className={`group relative overflow-hidden hairline cursor-pointer ${mode.span}`}
  >
    {/* image layer */}
    <div className="absolute inset-0">
      <img
        src={mode.image}
        alt={mode.title}
        className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
      />
    </div>
    {/* overlay */}
    <div className="absolute inset-0 bg-black/65 group-hover:bg-black/40 transition-colors duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

    {/* content */}
    <div className="relative z-10 h-full min-h-[380px] sm:min-h-[420px] lg:min-h-[420px] p-6 sm:p-8 md:p-12 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
          Mode {mode.tag}
        </span>
        <ArrowUpRight
          size={18}
          strokeWidth={1.2}
          className="text-white/40 group-hover:text-[#D4AF37] group-hover:rotate-45 transition-all duration-500 sm:w-5 sm:h-5"
        />
      </div>

      <div>
        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[0.95] mb-3 sm:mb-4">
          {mode.title}
        </h3>
        <p className="font-serif italic text-[#D4AF37]/90 text-base sm:text-lg md:text-xl mb-3 sm:mb-4">
          {mode.subtitle}
        </p>
        <p className="text-white/65 text-xs sm:text-sm md:text-base leading-relaxed max-w-md">
          {mode.body}
        </p>

        <ul className="mt-4 sm:mt-6 flex flex-wrap gap-2">
          {mode.points.map((p) => (
            <li
              key={p}
              className="hairline px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/70"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.article>
  );
};

export const ThreeModes = () => {
  return (
    <section
      id="modes"
      data-testid="modes-section"
      className="relative py-20 sm:py-28 md:py-40"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 sm:mb-16 md:mb-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-4 sm:mb-6">
              03 — Three Worlds
            </p>
            <h2 className="font-serif font-light text-white text-4xl sm:text-5xl md:text-7xl leading-[0.92] tracking-tight max-w-2xl">
              One engine.
              <br />
              <span className="italic text-white/70">Three</span> rooms.
            </h2>
          </div>
          <p className="text-white/55 text-sm sm:text-base md:text-lg max-w-sm leading-relaxed">
            Marquee adapts its temperament — gentle for learners, ruthless for
            recruiters, surgical for solo practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 auto-rows-[380px] sm:auto-rows-[420px]">
          {MODES.map((m, i) => (
            <Card key={i} mode={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeModes;