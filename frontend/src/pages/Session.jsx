import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Pause,
  Play,
  SkipForward,
  StopCircle,
} from "lucide-react";
import { SCRIPTS } from "@/data/interviewScripts";
import InterviewerCam from "@/components/session/InterviewerCam";
import useLiveInterview from "@/hooks/useLiveInterview";

// Typewriter hook
const useTypewriter = (text, speed = 18, key) => {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [key, text, speed]);
  return out;
};

const AudioBars = ({ active }) => (
  <div className="flex items-end gap-[3px] h-6">
    {[0.4, 0.7, 0.5, 0.9, 0.3, 0.8, 0.6, 0.5, 0.7, 0.4].map((h, i) => (
      <span
        key={i}
        style={{
          height: `${h * 100}%`,
          animationDelay: `${i * 0.08}s`,
          animationPlayState: active ? "running" : "paused",
        }}
        className={`audio-bar w-[3px] ${active ? "bg-[#D4AF37]" : "bg-white/20"}`}
      />
    ))}
  </div>
);

const Timer = ({ paused }) => {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <span className="font-mono text-[11px] text-white/70 tracking-[0.2em]">
      {mm}:{ss}
    </span>
  );
};

export default function Session() {
  const { domain } = useParams();
  const navigate = useNavigate();
  const script = SCRIPTS[domain];
  const [stepIndex, setStepIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const transcriptRef = useRef(null);

  const step = script?.steps[stepIndex];
  const totalSteps = script?.steps.length || 0;
  const progress = Math.min(
    100,
    ((stepIndex + (showAnswer ? 0.5 : 0)) / Math.max(totalSteps, 1)) * 100,
  );

  const typedQuestion = useTypewriter(
    step?.question || "",
    18,
    `q-${stepIndex}`,
  );
  const typedAnswer = useTypewriter(
    showAnswer ? step?.candidate || "" : "",
    12,
    `a-${stepIndex}-${showAnswer}`,
  );

  // Auto-scroll transcript
  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [typedQuestion, typedAnswer]);

  const codeForCurrent = useMemo(() => {
    if (!script) return null;
    for (let i = stepIndex; i >= 0; i--) {
      if (script.steps[i].code) return script.steps[i].code;
    }
    return null;
  }, [stepIndex, script]);

  // Live AI mode — talks to Groq for real
  const live = useLiveInterview(domain);
  const isLive = live.phase !== "idle" && live.phase !== "error";

  if (!script) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-3xl">Room not found.</p>
          <Link
            to="/demo"
            className="mt-6 inline-block hairline-strong px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors"
          >
            Back to lobby
          </Link>
        </div>
      </div>
    );
  }

  const nextTurn = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      return;
    }
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      setShowAnswer(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return <Scorecard script={script} domain={domain} />;
  }

  return (
    <main
      data-testid="session-page"
      className="relative min-h-screen bg-[#050505] text-white grain overflow-hidden"
    >
      {/* Ambient halo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#D4AF37]/8 blur-[160px] pointer-events-none" />

      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link
            to="/demo"
            data-testid="session-exit"
            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="text-[11px] uppercase tracking-[0.3em]">Exit</span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 hidden md:inline">
              Marquee · Session 0341
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                Live
              </span>
            </div>
            <Timer paused={paused} />
          </div>

          <div className="flex items-center gap-3">
            {live.phase === "idle" ? (
              <button
                onClick={live.start}
                data-testid="session-start-live"
                className="btn-royal bg-[#D4AF37] text-black px-4 py-2 text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-colors inline-flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Start Live AI Round
              </button>
            ) : (
              <button
                onClick={live.stop}
                data-testid="session-stop-live"
                className="hairline-strong px-4 py-2 text-[10px] uppercase tracking-[0.3em] hover:bg-red-500/20 hover:border-red-500/40 transition-colors"
              >
                End Live · {live.phase}
              </button>
            )}
            <button
              data-testid="session-pause"
              onClick={() => setPaused((p) => !p)}
              className="hairline w-9 h-9 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              title={paused ? "Resume" : "Pause"}
            >
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button
              data-testid="session-mute"
              onClick={() => setMuted((m) => !m)}
              className="hairline w-9 h-9 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            <button
              data-testid="session-end"
              onClick={() => setFinished(true)}
              className="hairline-strong px-4 py-2 text-[10px] uppercase tracking-[0.3em] hover:bg-red-500/20 hover:border-red-500/40 transition-colors inline-flex items-center gap-2"
            >
              <StopCircle size={12} /> End
            </button>
          </div>
        </div>
        {/* Progress */}
        <div className="h-px bg-white/5 relative">
          <motion.div
            className="absolute top-0 left-0 h-px bg-[#D4AF37]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Main layout */}
      <div className="pt-24 pb-32 px-4 md:px-10">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — Interviewer cam + Transcript */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-[78vh]">
            {/* Interviewer 2.5D cam */}
            <div className="h-[260px] shrink-0">
              <InterviewerCam
                script={script}
                speaking={
                  isLive
                    ? live.phase === "speaking"
                    : !showAnswer &&
                      typedQuestion.length < (step?.question.length || 0)
                }
                listening={
                  isLive ? live.phase === "listening" : showAnswer
                }
                amplitude={isLive ? live.amplitude : undefined}
              />
            </div>

            {/* Transcript */}
            <div className="hairline bg-black/40 backdrop-blur-2xl flex flex-col flex-1 min-h-0">
              <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  {script.label}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Turn {stepIndex + 1} / {totalSteps}
                </p>
              </div>

            <div
              ref={transcriptRef}
              className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-8"
              data-testid="session-transcript"
            >
              {isLive ? (
                <LiveTranscript live={live} />
              ) : (
                <>
                  {/* All prior turns */}
                  {script.steps.slice(0, stepIndex).map((s, i) => (
                    <PastTurn key={i} step={s} />
                  ))}

                  {/* Current turn */}
                  <div>
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] pt-2 w-20 shrink-0">
                        Marquee
                      </span>
                      <p className="font-serif text-2xl md:text-[28px] text-white leading-snug">
                        &ldquo;{typedQuestion}
                        {typedQuestion.length < (step?.question.length || 0) && (
                          <span className="cursor-blink text-[#D4AF37]">|</span>
                        )}
                        &rdquo;
                      </p>
                    </div>

                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mt-6 hairline bg-white/[0.02] p-5 ml-0 md:ml-24"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.3em]">
                            You · speaking
                          </span>
                          <AudioBars active={!paused && !muted} />
                        </div>
                        <p className="text-white/85 text-sm md:text-base leading-relaxed">
                          &ldquo;{typedAnswer}
                          {typedAnswer.length < (step?.candidate.length || 0) && (
                            <span className="cursor-blink text-[#D4AF37]">|</span>
                          )}
                          &rdquo;
                        </p>
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Control footer */}
            <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                {isLive
                  ? phaseLabel[live.phase] || "Live AI mode"
                  : showAnswer
                  ? "Your turn ended. Awaiting follow-up."
                  : "Marquee is asking…"}
              </p>
              {isLive ? (
                <button
                  onClick={live.stopRecording}
                  disabled={live.phase !== "listening"}
                  data-testid="session-live-submit"
                  className="btn-royal bg-white text-black px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-colors inline-flex items-center gap-2 disabled:opacity-40"
                >
                  Stop &amp; submit <SkipForward size={12} />
                </button>
              ) : (
                <button
                  onClick={nextTurn}
                  data-testid="session-next-turn"
                  className="btn-royal bg-white text-black px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-colors inline-flex items-center gap-2"
                >
                  {nextTurnLabel(showAnswer, stepIndex, totalSteps)}
                  <SkipForward size={12} />
                </button>
              )}
            </div>
            </div>
          </div>

          {/* RIGHT — Side panels */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-[78vh]">
            {/* Code editor or Notes */}
            {codeForCurrent ? (
              <div className="hairline bg-[#080808] flex-1 flex flex-col">
                <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] ml-3">
                      solution.py
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/40">
                    Python 3.11
                  </span>
                </div>
                <pre
                  data-testid="session-code"
                  className="font-mono text-[12px] md:text-[13px] leading-relaxed p-5 text-white/85 overflow-auto flex-1"
                >
                  {codeForCurrent.split("\n").map((line, i) => (
                    <div key={i}>
                      <span className="text-white/30 select-none mr-3">
                        {String(i + 1).padStart(2, " ")}
                      </span>
                      {tokenize(line).map((t, j) => (
                        <span
                          key={j}
                          style={tokenStyle(t)}
                        >
                          {t.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </pre>
              </div>
            ) : (
              <NotesPanel script={script} stepIndex={stepIndex} />
            )}

            {/* AI assessment panel */}
            <div className="hairline bg-black/40 backdrop-blur-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  Live read
                </p>
                <span className="font-mono text-[10px] text-white/40">
                  updated continuously
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Clarity", v: 78 + stepIndex * 3 },
                  { label: "Depth of reasoning", v: 64 + stepIndex * 6 },
                  { label: "Confidence", v: 72 + stepIndex * 2 },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-white/70">{m.label}</span>
                      <span className="font-mono text-white/50">{Math.min(m.v, 96)}</span>
                    </div>
                    <div className="h-px bg-white/8">
                      <motion.div
                        className="h-px bg-[#D4AF37]"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(m.v, 96)}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const KEYWORDS = new Set([
  "def", "return", "while", "if", "and", "or", "not", "None",
  "True", "False", "for", "in", "class", "else", "elif",
]);

const nextTurnLabel = (showAnswer, stepIndex, totalSteps) => {
  if (!showAnswer) return "Reveal sample answer";
  if (stepIndex < totalSteps - 1) return "Continue";
  return "Conclude session";
};

const tokenStyle = (t) => {
  if (t.kw) return { color: "#D4AF37" };
  if (t.comment) return { color: "#52525B" };
  return undefined;
};

const tokenize = (line) => {
  // Split off comment first
  const hashIdx = line.indexOf("#");
  let main = line;
  let comment = "";
  if (hashIdx >= 0) {
    main = line.slice(0, hashIdx);
    comment = line.slice(hashIdx);
  }
  const parts = main.split(/(\b[A-Za-z_][A-Za-z0-9_]*\b)/g);
  const tokens = parts
    .filter((p) => p !== "")
    .map((p) => ({ text: p, kw: KEYWORDS.has(p) }));
  if (comment) tokens.push({ text: comment, comment: true });
  return tokens;
};

const phaseLabel = {
  asking: "Marquee is thinking…",
  speaking: "Marquee is speaking…",
  listening: "Listening to you · speak now",
  transcribing: "Transcribing your answer…",
  ended: "Interview concluded.",
  error: "Something went wrong.",
};

const LiveTranscript = ({ live }) => (
  <div className="space-y-7">
    {live.history.map((turn, i) =>
      turn.role === "assistant" ? (
        <div key={i} className="flex items-start gap-4">
          <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] pt-2 w-20 shrink-0">
            Marquee
          </span>
          <p className="font-serif text-xl md:text-2xl text-white leading-snug">
            &ldquo;{turn.content}&rdquo;
          </p>
        </div>
      ) : (
        <div
          key={i}
          className="hairline bg-white/[0.02] p-4 ml-0 md:ml-24"
        >
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.3em] mb-2 block">
            You
          </span>
          <p className="text-white/85 text-sm md:text-base leading-relaxed">
            &ldquo;{turn.content}&rdquo;
          </p>
        </div>
      ),
    )}

    {live.phase === "speaking" && live.currentQuestion && (
      <div className="flex items-start gap-4 opacity-90">
        <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] pt-2 w-20 shrink-0">
          Marquee
        </span>
        <p className="font-serif text-2xl md:text-[28px] text-white leading-snug">
          &ldquo;{live.currentQuestion}
          <span className="cursor-blink text-[#D4AF37]">|</span>&rdquo;
        </p>
      </div>
    )}

    {live.phase === "listening" && (
      <div className="hairline bg-[#D4AF37]/10 border-[#D4AF37]/40 p-5 ml-0 md:ml-24">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-[0.3em]">
            You · recording
          </span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
        <p className="text-white/70 text-sm italic">
          Speak naturally. Auto-stops in 25 seconds, or click &ldquo;Stop &amp;
          submit&rdquo; below.
        </p>
      </div>
    )}

    {live.phase === "transcribing" && (
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
        ✦ Transcribing your answer…
      </p>
    )}

    {live.error && (
      <div className="hairline border-red-500/40 bg-red-500/10 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-300 mb-1">
          Live mode error
        </p>
        <p className="text-white/70 text-sm">{live.error}</p>
      </div>
    )}

    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 pt-4 border-t border-white/5">
      {phaseLabel[live.phase] || "Live AI mode"}
    </p>
  </div>
);

const PastTurn = ({ step }) => (
  <div className="opacity-50">
    <div className="flex items-start gap-4">
      <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] pt-1.5 w-20 shrink-0">
        Marquee
      </span>
      <p className="font-serif text-lg text-white leading-snug">
        &ldquo;{step.question}&rdquo;
      </p>
    </div>
    <p className="text-white/60 text-sm leading-relaxed ml-0 md:ml-24 mt-2">
      &ldquo;{step.candidate}&rdquo;
    </p>
  </div>
);

const NotesPanel = ({ script, stepIndex }) => (
  <div className="hairline bg-black/40 backdrop-blur-2xl flex-1 p-6 flex flex-col">
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
      Examiner&apos;s lens
    </p>
    <h3 className="font-serif text-2xl text-white leading-tight mb-3">
      What Marquee is looking for
    </h3>
    <ul className="mt-4 space-y-4 text-white/65 text-sm leading-relaxed">
      {[
        "Structured reasoning before jumping to conclusions.",
        "Honest 'I don't know' when warranted — followed by a path to figure it out.",
        "Concrete examples from your own experience, not textbook recitals.",
        "Composure under pressure — pace, not panic.",
      ].map((t, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="block w-1.5 h-1.5 bg-[#D4AF37] rotate-45 mt-2 shrink-0" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
    <p className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
      Turn {stepIndex + 1} of {script.steps.length}
    </p>
  </div>
);

const Scorecard = ({ script, domain }) => {
  const navigate = useNavigate();
  const metrics = [
    { label: "Clarity of thought", v: 88 },
    { label: "Depth of reasoning", v: 81 },
    { label: "Communication", v: 84 },
    { label: "Composure", v: 90 },
    { label: "Domain fluency", v: 76 },
  ];
  const overall = Math.round(
    metrics.reduce((a, b) => a + b.v, 0) / metrics.length,
  );

  return (
    <main
      data-testid="scorecard-page"
      className="relative min-h-screen bg-[#050505] text-white grain overflow-hidden"
    >
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full bg-[#D4AF37]/12 blur-[160px] pointer-events-none" />

      <header className="fixed top-0 inset-x-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link
            to="/demo"
            className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-[11px] uppercase tracking-[0.3em]">Lobby</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="block w-2 h-2 bg-[#D4AF37] rotate-45" />
            <span className="font-serif text-2xl">Marquee</span>
          </div>
          <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Stage · Verdict
          </span>
        </div>
      </header>

      <section className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-8"
          >
            ✦ Session 0341 · Concluded
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-serif font-light text-white text-5xl md:text-7xl leading-[0.92] tracking-tight"
          >
            The verdict, <span className="italic text-[#D4AF37]">candidly.</span>
          </motion.h1>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Overall */}
            <div className="lg:col-span-5 hairline p-10 flex flex-col justify-between min-h-[360px]">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Overall — {script.label}
              </p>
              <div>
                <p className="font-serif text-[140px] leading-none text-white tracking-tight">
                  {overall}
                  <span className="text-[#D4AF37] text-5xl align-top">/100</span>
                </p>
                <p className="font-serif italic text-white/70 text-xl mt-4">
                  &ldquo;Composed, structured, and surprising in two moments.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <span className="block w-12 h-px bg-white/30" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]">
                  Recommended for next round
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="lg:col-span-7 space-y-5">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  data-testid={`scorecard-metric-${i}`}
                  className="hairline p-6 hover:border-[#D4AF37]/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-serif text-xl text-white">{m.label}</p>
                    <p className="font-mono text-2xl text-white">{m.v}</p>
                  </div>
                  <div className="h-px bg-white/10 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.v}%` }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                      className="absolute top-0 left-0 h-px bg-[#D4AF37]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Marquee's closing remark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 border-l border-[#D4AF37]/50 pl-8 py-2 max-w-3xl"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
              Marquee&apos;s closing remark
            </p>
            <p className="font-serif italic text-2xl md:text-3xl text-white/90 leading-snug">
              &ldquo;{script.closing}&rdquo;
            </p>
          </motion.div>

          {/* Actions */}
          <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate(`/demo/${domain}`, { replace: true })}
              data-testid="scorecard-retry"
              className="btn-royal hairline-strong px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors"
            >
              Run it again
            </button>
            <Link
              to="/demo"
              data-testid="scorecard-new-room"
              className="btn-royal hairline-strong px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors"
            >
              Try a different room
            </Link>
            <Link
              to="/"
              data-testid="scorecard-home"
              className="btn-royal bg-white text-black px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-colors"
            >
              Request full access
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
