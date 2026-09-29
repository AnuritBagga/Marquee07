import { useEffect, useRef } from "react";

/**
 * WaveformBar
 * Props:
 *   active  — boolean, whether bars should animate
 *   mode    — "speaking" (gold) | "listening" (red) | "idle"
 *   amplitude — 0..1 float for speaking pulse (from TTS animation)
 *   count   — number of bars (default 18)
 */
export default function WaveformBar({ active = false, mode = "idle", amplitude = 0, count = 18 }) {
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const t0Ref = useRef(performance.now());

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      barsRef.current.forEach((b) => {
        if (b) b.style.height = "4px";
      });
      return;
    }

    t0Ref.current = performance.now();

    const tick = () => {
      const t = (performance.now() - t0Ref.current) / 1000;
      barsRef.current.forEach((b, i) => {
        if (!b) return;
        let h;
        if (mode === "speaking") {
          // Smooth sine wave driven by amplitude
          const base = 4 + amplitude * 22;
          h = base + Math.sin(t * 7.5 + i * 0.45) * amplitude * 10 + (Math.random() - 0.5) * 2;
        } else {
          // Listening — random noise bars
          h = 4 + Math.random() * 22;
        }
        b.style.height = `${Math.max(4, Math.min(28, h))}px`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, mode, amplitude]);

  const color =
    mode === "speaking" ? "bg-[#D4AF37]" :
    mode === "listening" ? "bg-red-500" :
    "bg-white/10";

  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          className={`w-[3px] rounded-sm transition-none ${active ? color : "bg-white/10"}`}
          style={{ height: "4px" }}
        />
      ))}
    </div>
  );
}