import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, ChevronRight, FastForward } from "lucide-react";
import * as THREE from "three";

import InterviewRoom from "@/components/three/InterviewRoom";
import CinematicCamera from "@/components/three/CinematicCamera";
import Lion from "@/components/brand/Lion";
import { SCRIPTS } from "@/data/interviewScripts";

const TOTAL_DURATION = 8.5; // seconds

// Driver — owns the timeline so React UI overlays sync with the 3D scene
const useTimeline = (running) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    let raf;
    const t0 = performance.now();
    const tick = () => {
      setT((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return t;
};

export default function Enter() {
  const { domain } = useParams();
  const navigate = useNavigate();
  const script = SCRIPTS[domain];
  const [started, setStarted] = useState(false);
  const elapsed = useTimeline(started);

  if (!script) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <p className="font-serif text-3xl">Room not found.</p>
      </div>
    );
  }

  // Phase derivation
  const doorOpen = Math.max(0, Math.min(1, started ? (elapsed - 0.2) / 1.2 : 0));
  const showSubtitle = elapsed > 4.3 && elapsed < 6.0;
  const showSitCue = elapsed > 5.6 && elapsed < 7.4;
  const canBegin = elapsed > TOTAL_DURATION - 1;

  const skip = () => navigate(`/demo/${domain}`);

  return (
    <main
      data-testid="enter-page"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 1.6]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          camera={{ position: [0, 1.7, 11.2], fov: 52, near: 0.1, far: 80 }}
          onCreated={({ scene }) => {
            scene.fog = new THREE.FogExp2("#050505", 0.045);
            scene.background = new THREE.Color("#020202");
          }}
        >
          <CinematicCamera elapsed={elapsed} started={started} />
          <InterviewRoom
            doorOpen={doorOpen}
            subtitle={showSubtitle ? '"Welcome. Please, have a seat."' : ""}
            chairpersonPortrait={script.portrait}
          />
        </Canvas>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.55)_85%,#000_100%)] grain" />

      {/* Top bar */}
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link
            to="/demo"
            data-testid="enter-back"
            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="text-[11px] uppercase tracking-[0.3em]">Back to Lobby</span>
          </Link>
          <div className="flex items-center gap-3">
            <Lion size={24} testId="enter-nav-lion" />
            <span className="font-serif text-2xl tracking-tight">Marquee</span>
          </div>
          <button
            onClick={skip}
            data-testid="enter-skip"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em]"
          >
            Skip the walk-in <FastForward size={12} />
          </button>
        </div>
      </header>

      {/* Pre-start prompt */}
      <AnimatePresence>
        {!started && (
          <motion.div
            key="prestart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center pointer-events-auto max-w-xl px-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-[#D4AF37] mb-8">
                ✦ {script.label}
              </p>
              <h1 className="font-serif font-light text-white text-5xl md:text-7xl leading-[0.95] tracking-tight">
                Step through
                <br />
                <span className="italic text-white/70">the door.</span>
              </h1>
              <p className="mt-8 text-white/55 text-base md:text-lg leading-relaxed">
                The panel is waiting. {script.interviewer} will lead the
                conversation. Take a breath.
              </p>
              <button
                onClick={() => setStarted(true)}
                data-testid="enter-begin"
                className="btn-royal mt-12 bg-white text-black px-10 py-5 text-[11px] uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-colors inline-flex items-center gap-3"
              >
                <Play size={14} /> Open the door
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* In-walk subtitle (HTML overlay backup for accessibility) */}
      <AnimatePresence>
        {showSubtitle && (
          <motion.div
            key="subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-32 inset-x-0 z-20 flex justify-center pointer-events-none"
          >
            <div className="text-center max-w-2xl px-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-3">
                Chairperson
              </p>
              <p className="font-serif italic text-2xl md:text-4xl text-white leading-snug">
                &ldquo;Welcome. Please, have a seat.&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sit cue */}
      <AnimatePresence>
        {showSitCue && (
          <motion.div
            key="sitcue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-10 inset-x-0 z-20 flex justify-center pointer-events-none"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
              ✦ Settling in ✦
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final CTA when seated */}
      <AnimatePresence>
        {canBegin && (
          <motion.div
            key="settled"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute bottom-12 inset-x-0 z-20 flex justify-center"
          >
            <button
              onClick={() => navigate(`/demo/${domain}`)}
              data-testid="enter-begin-interview"
              className="btn-royal bg-white text-black px-12 py-5 text-[11px] uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-colors inline-flex items-center gap-3"
            >
              Begin Interview <ChevronRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side meta labels */}
      <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-2 rotate-180 [writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.4em] text-white/30 pointer-events-none">
        <span>Marquee · Chamber 0341</span>
      </div>
      <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-2 [writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.4em] text-white/30 pointer-events-none">
        <span>Reel · 02 — The Walk-in</span>
      </div>
    </main>
  );
}
