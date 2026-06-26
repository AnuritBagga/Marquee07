import { useEffect, useRef } from "react";
import Lion from "../brand/Lion";

/**
 * PracticeScorecard
 * Props:
 *   score        — object from /practice/evaluate
 *   candidateName
 *   durationSeconds
 *   history      — full conversation history (for download)
 *   interviewType
 *   onRestart    — fn to go back to setup
 */
export default function PracticeScorecard({ score, candidateName, durationSeconds, history, interviewType, onRestart }) {
  const barsRef = useRef({});

  // Animate metric bars on mount
  useEffect(() => {
    if (!score?.metrics) return;
    const timeout = setTimeout(() => {
      score.metrics.forEach((m) => {
        const el = barsRef.current[m.name];
        if (el) el.style.width = `${m.score}%`;
      });
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  if (!score) return null;

  const fmt = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}m ${String(sec).padStart(2, "0")}s`;
  };

  const verdictColor = {
    Shortlist: "text-green-400 border-green-400/30 bg-green-400/5",
    Consider: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    Reject: "text-red-400 border-red-400/30 bg-red-400/5",
  }[score.verdict] || "text-white/50 border-white/10";

  const downloadTranscript = () => {
    const lines = history.map((t) =>
      `[${t.role === "assistant" ? "INTERVIEWER" : "YOU"}]\n${t.content}\n`
    ).join("\n---\n\n");
    const header = [
      "MARQUEE — INTERVIEW TRANSCRIPT",
      `Date: ${new Date().toLocaleString("en-IN")}`,
      `Candidate: ${candidateName}`,
      `Type: ${interviewType}`,
      `Duration: ${fmt(durationSeconds)}`,
      `Overall Score: ${score.overall}/100 (${score.grade})`,
      `Verdict: ${score.verdict}`,
      "=".repeat(48),
      "",
    ].join("\n");
    const blob = new Blob([header + lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marquee-interview-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md">
        <button 
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          title="Go to Home"
        >
          <Lion className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <div className="font-serif text-xl tracking-widest text-[#D4AF37]">
            Marquee <span className="text-white/30 text-xs tracking-[0.3em] font-sans ml-2">SCORECARD</span>
          </div>
        </button>
        <div className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 px-3 py-1">
          Session Complete
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Thank You Message */}
        <div className="text-center mb-12 pb-8 border-b border-white/7">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-serif text-3xl text-white mb-3">Thank You!</h2>
          <p className="text-white/50 text-sm">Your interview session is complete. Here's your performance scorecard.</p>
        </div>

        {/* Title */}
        <div className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-4">Performance Analysis</div>
        <h1 className="font-serif text-4xl font-light text-white mb-2 leading-tight">
          Your Performance<br /><em>Report</em>
        </h1>
        <p className="text-white/30 text-sm mb-10">
          {candidateName} · {fmt(durationSeconds)} · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {/* Score orb + verdict */}
        <div className="flex items-center gap-8 mb-10">
          <div className="w-28 h-28 rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/8 flex flex-col items-center justify-center shrink-0"
            style={{ boxShadow: "0 0 40px rgba(212,175,55,0.15)" }}>
            <span className="font-serif text-4xl text-[#D4AF37] leading-none">{score.overall}</span>
            <span className="text-[10px] text-white/30 tracking-widest uppercase mt-1">Overall</span>
          </div>
          <div>
            <div className="font-serif text-5xl text-white/20 leading-none mb-2">{score.grade}</div>
            <div className={`inline-block text-xs tracking-widest uppercase px-3 py-1.5 border ${verdictColor}`}>
              {score.verdict}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {score.metrics?.map((m) => (
            <div key={m.name} className="bg-[#0A0A0A] border border-white/7 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] tracking-widest uppercase text-white/30">{m.name}</span>
                <span className="text-white text-sm font-medium">{m.score}<span className="text-white/20 text-xs">/100</span></span>
              </div>
              <div className="h-px bg-white/5 relative">
                <div
                  ref={(el) => (barsRef.current[m.name] = el)}
                  className="h-px bg-[#D4AF37] transition-all duration-1000 ease-out"
                  style={{ width: "0%" }}
                />
              </div>
              {m.note && <p className="text-white/20 text-[11px] mt-1.5">{m.note}</p>}
            </div>
          ))}
        </div>

        {/* Strengths + Improvements */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-[#0A0A0A] border border-green-400/10 p-4">
            <div className="text-[10px] tracking-widest uppercase text-green-400 mb-3">Strengths</div>
            <ul className="space-y-2">
              {score.strengths?.map((s, i) => (
                <li key={i} className="text-white/50 text-sm leading-relaxed flex gap-2">
                  <span className="text-green-400/60 shrink-0">+</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#0A0A0A] border border-yellow-400/10 p-4">
            <div className="text-[10px] tracking-widest uppercase text-yellow-400 mb-3">Improve</div>
            <ul className="space-y-2">
              {score.improvements?.map((s, i) => (
                <li key={i} className="text-white/50 text-sm leading-relaxed flex gap-2">
                  <span className="text-yellow-400/60 shrink-0">→</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-[#0A0A0A] border border-white/7 p-5 mb-4">
          <div className="text-[10px] tracking-widest uppercase text-[#D4AF37] mb-3">AI Interviewer Feedback</div>
          <p className="text-white/60 text-sm leading-relaxed">{score.feedback}</p>
        </div>

        {/* Filler Analysis & Delivery Notes */}
        {(score.fillerAnalysis || score.deliveryNotes) && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {score.fillerAnalysis && (
              <div className="bg-[#0A0A0A] border border-blue-400/10 p-4">
                <div className="text-[10px] tracking-widest uppercase text-blue-400 mb-2">Filler Words</div>
                <p className="text-white/50 text-[13px] leading-relaxed">{score.fillerAnalysis}</p>
              </div>
            )}
            {score.deliveryNotes && (
              <div className="bg-[#0A0A0A] border border-purple-400/10 p-4">
                <div className="text-[10px] tracking-widest uppercase text-purple-400 mb-2">Delivery & Pacing</div>
                <p className="text-white/50 text-[13px] leading-relaxed">{score.deliveryNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Code feedback */}
        {score.codeFeedback && (
          <div className="bg-[#0A0A0A] border border-white/7 p-5 mb-8">
            <div className="text-[10px] tracking-widest uppercase text-[#D4AF37] mb-3">Code Evaluation</div>
            <p className="text-white/60 text-sm leading-relaxed">{score.codeFeedback}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap mt-8">
          <button
            onClick={() => window.location.href = "/"}
            className="bg-[#D4AF37] text-black text-xs font-semibold tracking-widest uppercase px-8 py-3.5 hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Home Page
          </button>
          <button
            onClick={onRestart}
            className="border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold tracking-widest uppercase px-8 py-3.5 hover:bg-[#D4AF37]/8 transition-all"
          >
            Practice Again
          </button>
          <button
            onClick={downloadTranscript}
            className="border border-white/10 text-white/40 text-xs tracking-widest uppercase px-6 py-3.5 hover:border-white/20 hover:text-white/60 transition-all"
          >
            Download Transcript
          </button>
        </div>
      </div>
    </div>
  );
}