import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { INTERVIEW_TYPES } from "../data/practiceConfig";
import Lion from "../components/brand/Lion";
import { LION_PARTICLES } from "../data/lionParticles";

export default function Practice() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const handleTypeSelect = (typeId) => {
    // Only Technical, Engineering, and MBA have mode selection
    // UPSC, Law, and Defence go directly to setup with 'general' mode
    const typesWithModeSelection = ['technical', 'engineering', 'mba'];
    
    if (typesWithModeSelection.includes(typeId)) {
      navigate(`/practice/mode/${typeId}`);
    } else {
      navigate(`/practice/setup/${typeId}/general`);
    }
  };

  // Initialize particle lion animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      nx, ny, hx: 0, hy: 0, x: 0, y: 0, vx: 0, vy: 0, r, g, b,
    }));

    resize();
    window.addEventListener("resize", resize);

    for (const p of particles) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * Math.max(W, H) * 0.25;
      p.x = p.hx + Math.cos(ang) * dist;
      p.y = p.hy + Math.sin(ang) * dist;
    }

    let mouseX = -9999, mouseY = -9999;
    const handleMouseMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    const handleMouseLeave = () => { mouseX = -9999; mouseY = -9999; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const SPRING = 0.05, DAMPING = 0.9;
    const MOUSE_RADIUS = reduceMotion ? 0 : 80, MOUSE_FORCE = 650;

    function step(dt) {
      for (const p of particles) {
        const mdx = p.x - mouseX, mdy = p.y - mouseY, mdist = Math.hypot(mdx, mdy);
        if (mdist < MOUSE_RADIUS) {
          const f = (1 - mdist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (mdx / (mdist || 1)) * f * dt;
          p.vy += (mdy / (mdist || 1)) * f * dt;
        }
        const ax = (p.hx - p.x) * SPRING, ay = (p.hy - p.y) * SPRING;
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
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},0.55)`;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }
      ctx.globalCompositeOperation = "source-over";
    }

    let last = performance.now(), animationId;
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

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Particle Lion Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          maskImage: "radial-gradient(60% 55% at 50% 42%, black 45%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(60% 55% at 50% 42%, black 45%, transparent 85%)",
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

      {/* Large decorative lion in corner */}
      <motion.div
        className="fixed top-20 right-0 pointer-events-none z-0 opacity-5"
        initial={{ x: 100, opacity: 0, rotate: -15 }}
        animate={{ x: 0, opacity: 0.08, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Lion size={400} glow={false} animate={false} className="opacity-40" />
      </motion.div>
      
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 sm:gap-0 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md relative">
        <motion.a 
          href="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Lion size={40} glow={true} animate={true} />
          <div className="font-serif text-lg sm:text-xl tracking-widest text-[#D4AF37]">
            Marquee <span className="text-white/30 text-[10px] sm:text-xs tracking-[0.3em] font-sans ml-2">PRACTICE</span>
          </div>
        </motion.a>
        <motion.span 
          className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 px-3 py-1 whitespace-nowrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Self Assessment
        </motion.span>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col gap-20 relative z-10">
        {/* ── Hero ── */}
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Centered Lion Logo with enhanced animation */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div className="relative">
              <Lion size={140} glow={true} animate={true} />
              {/* Pulsing ring around lion */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          <motion.p 
            className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF37] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            AI-Powered Interview Practice
          </motion.p>
          
          <motion.h1 
            className="font-serif text-6xl md:text-7xl font-light leading-tight text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Your Personal<br />
            <span className="relative inline-block">
              <em className="relative z-10">Interview Room</em>
              <motion.span 
                className="absolute bottom-2 left-0 w-full h-3 bg-[#D4AF37]/20"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1.5 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-white/50 leading-relaxed max-w-2xl mx-auto text-base mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            Upload your resume. The AI reads it, asks personalized questions, and cross-examines
            your answers — exactly like a real interviewer. 10–15 minutes of intensive practice.
          </motion.p>

          {/* Key features */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            {[
              { icon: "🎯", text: "Domain-Specific Questions" },
              { icon: "⚡", text: "Real-Time Feedback" },
              { icon: "📊", text: "Detailed Scorecard" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: "rgba(212, 175, 55, 0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="text-white/60 text-xs tracking-wide">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Interview Type Cards ── */}
        <div>
          <StepLabel n="01" label="Choose Interview Type" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {INTERVIEW_TYPES.map((t, idx) => (
              <motion.button
                key={t.id}
                onClick={() => handleTypeSelect(t.id)}
                className="group relative text-left border border-white/10 bg-gradient-to-br from-[#0A0A0A] to-[#050505] hover:border-[#D4AF37]/50 transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Glowing border effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                </div>

                <div className="relative z-10">
                  {/* Image instead of emoji */}
                  <div className="mb-5 relative overflow-hidden h-48 -mx-8 -mt-8">
                    {/* Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${t.image})` }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                    {/* Arrow icon on hover */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Content section with padding */}
                  <div className="px-8 pb-8">
                    {/* Title */}
                    <h3 className="text-lg font-medium text-white mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                      {t.label}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-white/50 leading-relaxed mb-4">
                      {t.desc}
                    </p>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i}
                          className="px-2 py-0.5 text-[10px] bg-white/5 text-white/40 border border-white/10 tracking-wide"
                        >
                          {skill}
                        </span>
                      ))}
                      {t.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] text-[#D4AF37]/60">
                          +{t.skills.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action hint */}
                    <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="tracking-wider uppercase">Start Interview</span>
                      <motion.svg 
                        className="w-3 h-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info Message */}
        <motion.div
          className="text-center max-w-2xl mx-auto p-6 border border-white/10 bg-gradient-to-br from-[#0A0A0A] to-[#050505] backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
              <span className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase">How it Works</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
            </div>
            
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Select your interview type above to continue.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-xs text-white/30">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]/50" />
              <span>
                <span className="text-[#D4AF37]/70 font-medium">Technical, Engineering & MBA</span> offer General or Targeted modes
              </span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StepLabel({ n, label, optional }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">{n} —</span>
      <span className="text-[11px] tracking-widest uppercase text-white/50">{label}</span>
      {optional && <span className="text-[10px] text-white/20 normal-case tracking-normal">(optional)</span>}
    </div>
  );
}