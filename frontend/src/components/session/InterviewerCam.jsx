import { useEffect, useState } from "react";

/**
 * InterviewerCam — a 2.5D portrait viewer with realistic lip-sync and facial animations.
 * 
 * Enhanced features:
 *   - Realistic mouth movements synchronized with speech
 *   - Natural eye blinking
 *   - Head movements (nods, tilts)
 *   - Micro-expressions
 *   - Breathing animation when idle
 */
export default function InterviewerCam({ script, speaking, listening, amplitude }) {
  const [tick, setTick] = useState(0);
  const [blinkState, setBlinkState] = useState(false);
  const [lastBlink, setLastBlink] = useState(0);
  
  // Animation tick for speaking
  useEffect(() => {
    if (!speaking) return;
    let raf;
    const t0 = performance.now();
    const loop = () => {
      setTick((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speaking]);

  // Realistic blinking system
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      const now = Date.now();
      // Random blink every 2-6 seconds
      const timeSinceBlink = now - lastBlink;
      const shouldBlink = timeSinceBlink > 2000 + Math.random() * 4000;
      
      if (shouldBlink) {
        setBlinkState(true);
        setLastBlink(now);
        setTimeout(() => setBlinkState(false), 150); // Blink duration
        
        // Sometimes double blink
        if (Math.random() > 0.7) {
          setTimeout(() => {
            setBlinkState(true);
            setTimeout(() => setBlinkState(false), 120);
          }, 250);
        }
      }
    }, 100);
    
    return () => clearInterval(blinkInterval);
  }, [lastBlink]);

  // Enhanced speaking animations
  const liveAmp = typeof amplitude === "number";
  
  // More pronounced scaling when speaking
  const sx = speaking ? 1 + Math.sin(tick * 8.3) * 0.012 : 1;
  const sy = speaking ? 1 + Math.sin(tick * 9.1) * 0.015 : 1;
  
  // More noticeable head movement when speaking
  const rot = speaking 
    ? Math.sin(tick * 2.5) * 1.2 + Math.cos(tick * 1.3) * 0.8
    : Math.sin(performance.now() * 0.0004) * 0.3;
  
  const xOff = speaking 
    ? Math.sin(tick * 2.7) * 3.5 + Math.cos(tick * 1.9) * 2.1
    : Math.sin(performance.now() * 0.0006) * 0.8;
  
  const yOff = speaking
    ? Math.sin(tick * 1.9) * 2.5 + Math.cos(tick * 2.3) * 1.8
    : Math.sin(performance.now() * 0.0007) * 1.2;

  // Enhanced mouth animation - much more visible
  const mouthPulse = speaking
    ? liveAmp
      ? 0.4 + amplitude * 0.85
      : 0.5 + Math.abs(Math.sin(tick * 12.5)) * 0.7
    : 0;

  // Jaw movement for realistic speaking
  const jawOpen = speaking
    ? 0.15 + Math.abs(Math.sin(tick * 11.3)) * 0.3 + Math.abs(Math.cos(tick * 7.8)) * 0.25
    : 0;

  // Additional mouth shape variations
  const mouthWidth = speaking
    ? 1 + Math.sin(tick * 8.9) * 0.15
    : 1;

  // Eyebrow movement when speaking (emphasis)
  const eyebrowRaise = speaking
    ? Math.abs(Math.sin(tick * 3.2)) * 0.3
    : 0;

  return (
    <div
      data-testid="interviewer-cam"
      className="relative w-full h-full overflow-hidden hairline bg-black"
    >
      {/* Boardroom background — desaturated, dark */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.32) saturate(0.4) blur(2px)",
          transform: "scale(1.08)",
        }}
      />

      {/* Warm halo behind subject's head - intensifies when speaking */}
      <div
        className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[55%] aspect-square rounded-full z-10"
        style={{
          background:
            "radial-gradient(circle at center, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.18) 30%, transparent 68%)",
          filter: "blur(20px)",
          opacity: speaking ? 1.3 : 0.85,
          transform: speaking ? "scale(1.08)" : "scale(1)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
      />

      {/* Portrait with enhanced animations - FULL FACE VISIBLE */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <img
          src={script.portrait}
          alt={script.interviewer}
          className="select-none pointer-events-none object-cover"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            transform: `translate(${xOff}px, ${yOff - eyebrowRaise * 2}px) scale(${sx}, ${sy}) rotate(${rot}deg)`,
            transformOrigin: "center center",
            filter: speaking
              ? "brightness(1.08) contrast(1.08) saturate(1.1)"
              : blinkState
              ? "brightness(0.92) contrast(1.02)"
              : "brightness(0.95) contrast(1.03) saturate(0.92)",
            transition: speaking
              ? "filter 150ms ease-out"
              : "filter 600ms ease-in",
          }}
          draggable={false}
        />
      </div>

      {/* Enhanced mouth glow with jaw movement */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: "50%",
          top: `${52 + jawOpen * 8}%`,
          transform: `translate(-50%, -50%) scaleX(${mouthWidth})`,
          width: `${44 + jawOpen * 15}%`,
          height: `${12 + jawOpen * 20}%`,
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.75) 0%, rgba(255,180,100,0.4) 40%, transparent 70%)",
          opacity: mouthPulse,
          filter: "blur(10px)",
          transition: "opacity 60ms linear",
        }}
      />

      {/* Inner mouth shadow for depth */}
      <div
        className="absolute z-29 pointer-events-none"
        style={{
          left: "50%",
          top: `${54 + jawOpen * 10}%`,
          transform: "translate(-50%, -50%)",
          width: `${20 + jawOpen * 25}%`,
          height: `${4 + jawOpen * 35}%`,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, transparent 60%)",
          opacity: jawOpen * 0.9,
          filter: "blur(3px)",
          borderRadius: "50%",
        }}
      />

      {/* Eye blink overlay */}
      {blinkState && (
        <div
          className="absolute z-35 pointer-events-none"
          style={{
            left: "50%",
            top: "35%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            height: "8%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
            filter: "blur(2px)",
          }}
        />
      )}

      {/* Eyebrow raise indicator */}
      {speaking && eyebrowRaise > 0.2 && (
        <div
          className="absolute z-31 pointer-events-none"
          style={{
            left: "50%",
            top: "28%",
            transform: `translate(-50%, -${eyebrowRaise * 5}px)`,
            width: "35%",
            height: "3%",
            background: "linear-gradient(to bottom, rgba(212,175,55,0.15), transparent)",
            filter: "blur(4px)",
            opacity: eyebrowRaise,
          }}
        />
      )}

      {/* Vignette + film tint */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,transparent_30%,rgba(0,0,0,0.45)_75%,#050505_100%)]" />

      {/* Top HUD */}
      <div className="absolute top-0 inset-x-0 z-50 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              speaking ? "bg-red-500 animate-pulse" : "bg-white/40"
            }`}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/70">
            {speaking ? "Speaking" : listening ? "Listening" : "On air"}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
          Live • HD
        </span>
      </div>

      {/* Bottom nameplate */}
      <div className="absolute bottom-0 inset-x-0 z-50 px-5 py-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <p className="font-serif text-lg md:text-xl text-white tracking-tight leading-tight">
          {script.interviewer.split("·")[0].trim()}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] mt-1">
          {script.interviewerTitle || script.label}
        </p>
      </div>

      {/* Enhanced audio bars with more bars */}
      {speaking && (
        <div className="absolute bottom-5 right-5 z-50 flex items-end gap-[2px] h-6">
          {[0.4, 0.7, 0.5, 0.9, 0.3, 0.8, 0.6, 0.75, 0.55, 0.85].map((h, i) => (
            <span
              key={i}
              style={{
                height: `${h * 100}%`,
                animationDelay: `${i * 0.05}s`,
              }}
              className="audio-bar w-[2.5px] bg-[#D4AF37] rounded-sm"
            />
          ))}
        </div>
      )}

      {/* Subtle breathing indicator when idle */}
      {!speaking && !listening && (
        <div
          className="absolute bottom-5 right-5 z-50"
          style={{
            animation: "pulse 3s ease-in-out infinite",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      )}
    </div>
  );
}
