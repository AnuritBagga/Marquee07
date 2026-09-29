import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Lion from "../components/brand/Lion";
import { getInterviewType } from "../data/practiceConfig";
import { LION_PARTICLES } from "../data/lionParticles";

export default function InterviewMode() {
  const { type } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const typeConfig = getInterviewType(type);

  useEffect(() => {
    if (!typeConfig) {
      navigate("/practice");
      return;
    }
  }, [typeConfig, navigate]);

  // Initialize particle lion animation (cursor-reactive, no scroll interaction)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Full sampled silhouette — 4,405 points, gives an actual recognizable lion shape
    const raw = LION_PARTICLES;

    let W, H, DPR;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      layout();
    }

    let originX, originY, drawSize;

    function layout() {
      // Sized and positioned to sit quietly behind content, not fight with it
      const shortSide = Math.min(W, H);
      drawSize = Math.min(shortSide * 0.5, 480);
      originX = W / 2 - drawSize / 2;
      originY = H / 2 - drawSize / 2 - H * 0.04;

      for (const p of particles) {
        p.hx = originX + p.nx * drawSize;
        p.hy = originY + p.ny * drawSize;
      }
    }

    const particles = raw.map(([nx, ny, r, g, b]) => ({
      nx,
      ny,
      hx: 0,
      hy: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r,
      g,
      b,
    }));

    resize();
    window.addEventListener("resize", resize);

    // Gentle entrance: fly in from a soft scatter into formation once on mount
    for (const p of particles) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * Math.max(W, H) * 0.25;
      p.x = p.hx + Math.cos(ang) * dist;
      p.y = p.hy + Math.sin(ang) * dist;
    }

    // Cursor repel — the only thing that disturbs the formation
    let mouseX = -9999,
      mouseY = -9999;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const SPRING = 0.05;
    const DAMPING = 0.9;
    const MOUSE_RADIUS = reduceMotion ? 0 : 80;
    const MOUSE_FORCE = 650;

    function step(dt) {
      for (const p of particles) {
        // cursor repel only — no scroll-driven scatter
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < MOUSE_RADIUS) {
          const f = (1 - mdist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (mdx / (mdist || 1)) * f * dt;
          p.vy += (mdy / (mdist || 1)) * f * dt;
        }

        // spring pulls it back home — the "magnet" settle
        const ax = (p.hx - p.x) * SPRING;
        const ay = (p.hy - p.y) * SPRING;
        p.vx = (p.vx + ax) * DAMPING;
        p.vy = (p.vy + ay) * DAMPING;
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        // Small, soft points and reduced opacity so it reads as background texture,
        // not a foreground graphic competing with the UI
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},0.55)`;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }

      ctx.globalCompositeOperation = "source-over";
    }

    let last = performance.now();
    let animationId;

    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      draw();
      animationId = requestAnimationFrame(frame);
    }

    animationId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleModeSelect = (mode) => {
    navigate(`/practice/setup/${type}/${mode}`);
  };

  if (!typeConfig) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Particle Lion Canvas — faded at the edges so it blends into the page background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          maskImage:
            "radial-gradient(60% 55% at 50% 42%, black 45%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(60% 55% at 50% 42%, black 45%, transparent 85%)",
        }}
        aria-hidden="true"
      />

      {/* Animated golden glow */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0.1, 0.18, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[600px] h-[600px] rounded-full bg-[#D4AF37]/20 blur-[120px]" />
      </motion.div>

      {/* Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md">
        <motion.button
          onClick={() => navigate("/practice")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Lion size={40} glow={true} animate={true} />
          <div className="font-serif text-xl tracking-widest text-[#D4AF37]">
            Marquee{" "}
            <span className="text-white/30 text-xs tracking-[0.3em] font-sans ml-2">
              PRACTICE
            </span>
          </div>
        </motion.button>

        <motion.span
          className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 px-3 py-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {typeConfig.label}
        </motion.span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center gap-16 relative z-10">
        {/* Hero */}
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="text-7xl">{typeConfig.icon}</div>
          </motion.div>

          <motion.p
            className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Interview Mode Selection
          </motion.p>

          <motion.h1
            className="font-serif text-5xl font-light leading-tight text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Choose Your
            <br />
            <em>{typeConfig.label}</em> Experience
          </motion.h1>

          <motion.p
            className="text-white/40 leading-relaxed text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {typeConfig.desc}
          </motion.p>
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* General Interview */}
          <motion.button
            onClick={() => handleModeSelect("general")}
            className="group relative p-8 border border-white/10 bg-[#0A0A0A] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300 text-left overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-white mb-3">General Interview</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Resume-based personalized questions. Upload your resume, add your
                name, optionally highlight skills. The AI will ask domain-specific
                questions based on your background.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-xs text-white/40">
                  <span className="text-[#D4AF37] mt-0.5">✓</span>
                  <span>Resume required (name mandatory)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/40">
                  <span className="text-[#D4AF37] mt-0.5">✓</span>
                  <span>Skills optional</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/40">
                  <span className="text-[#D4AF37] mt-0.5">✓</span>
                  <span>10-15 minute session</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium">
                <span>Start General Interview</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.button>

          {/* Specific Interview */}
          <motion.button
            onClick={() => handleModeSelect("specific")}
            className="group relative p-8 border border-white/10 bg-[#0A0A0A] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300 text-left overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-medium text-white mb-3">Targeted Interview</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Preparing for a specific role? Add job description and company
                details. The AI will tailor questions to match the exact position
                requirements.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-xs text-white/40">
                  <span className="text-[#D4AF37] mt-0.5">✓</span>
                  <span>Resume + Job description</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/40">
                  <span className="text-[#D4AF37] mt-0.5">✓</span>
                  <span>Company name & role details</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/40">
                  <span className="text-[#D4AF37] mt-0.5">✓</span>
                  <span>Role-specific deep-dive questions</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium">
                <span>Start Targeted Interview</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Tips */}
        <motion.div
          className="w-full max-w-2xl p-6 border border-white/10 bg-[#0A0A0A]/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <h4 className="text-xs tracking-widest uppercase text-[#D4AF37] mb-4">
            Interview Tips
          </h4>
          <ul className="space-y-2">
            {typeConfig.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-white/50 text-sm">
                <span className="text-[#D4AF37] mt-1 text-xs">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
