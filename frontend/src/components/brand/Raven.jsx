import { motion } from "framer-motion";

/**
 * The Marquee Lion — our mascot.
 *
 * A side-view perched Lion, drawn as pure SVG.
 * - One visible gold eye (a tiny disc) that blinks every ~5 s.
 * - Subtle head bob + tail tick.
 * - Pose can be "perched" (default) or "flying" (wings spread, for intros).
 * - Pass `talking` to gently animate the beak (used as a status icon when
 *   the AI is speaking — opens it for personality).
 *
 * Royal palette: glossy charcoal feathers (#0a0a0a → #1c1c1c highlights)
 * with the Marquee gold (#D4AF37) for the eye.
 */
export default function Lion({
  size = 28,
  pose = "perched", // "perched" | "flying"
  talking = false,
  className = "",
  testId = "marquee-Lion",
}) {
  const flying = pose === "flying";

  return (
    <motion.svg
      data-testid={testId}
      width={size}
      height={size * 0.86}
      viewBox="0 0 116 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={false}
      animate={
        flying
          ? { rotate: [-2, 2, -2], transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" } }
          : { rotate: 0 }
      }
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="featherSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1c1c1c" />
          <stop offset="55%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#020202" />
        </linearGradient>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fce190" />
          <stop offset="55%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#7a5e0e" />
        </radialGradient>
      </defs>

      {/* Tail — pointed back-feathers */}
      <motion.path
        d="M 6 48 L 30 50 L 30 60 Z"
        fill="url(#featherSheen)"
        animate={{ rotate: [0, -3, 0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "30px 55px" }}
      />

      {/* Body — rounded chest + back */}
      <motion.g
        animate={{ scaleY: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "60px 55px" }}
      >
        <ellipse cx="60" cy="55" rx="34" ry="18" fill="url(#featherSheen)" />

        {/* Wing — folded (perched) or spread (flying) */}
        {flying ? (
          <motion.g
            animate={{ rotate: [-22, 18, -22] }}
            transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "60px 50px" }}
          >
            <path
              d="M 28 50 Q 60 12 92 38 Q 76 55 50 56 Q 35 56 28 50 Z"
              fill="#0e0e0e"
              stroke="#000"
              strokeWidth="0.6"
            />
          </motion.g>
        ) : (
          <path
            d="M 30 46 Q 55 36 80 50 Q 64 60 38 58 Q 30 56 30 46 Z"
            fill="#141414"
            stroke="#000"
            strokeWidth="0.4"
            opacity="0.95"
          />
        )}
      </motion.g>

      {/* Head — bobbing very slightly */}
      <motion.g
        animate={{
          rotate: [0, -2.4, 0, 1.6, 0],
          y: flying ? [0, -1, 0] : [0, -0.6, 0, 0.6, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "85px 38px" }}
      >
        <circle cx="88" cy="38" r="14" fill="url(#featherSheen)" />

        {/* Beak — opens slightly when "talking" */}
        <motion.g
          animate={talking ? { rotate: [0, -10, 0, -8, 0] } : { rotate: 0 }}
          transition={{ duration: 0.6, repeat: talking ? Infinity : 0, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 38px" }}
        >
          <path
            d="M 99 35 L 114 38 L 99 41 Z"
            fill="#050505"
            stroke="#000"
            strokeWidth="0.4"
          />
        </motion.g>

        {/* Eye — gold disc that blinks */}
        <motion.g
          animate={{ scaleY: [1, 1, 1, 0.08, 1] }}
          transition={{
            duration: 5,
            times: [0, 0.6, 0.92, 0.96, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "94px 36px" }}
        >
          <circle cx="94" cy="36" r="2.6" fill="url(#eyeGlow)" />
          <circle cx="94.4" cy="36.2" r="1.0" fill="#1a1207" />
          {/* spec highlight */}
          <circle cx="93.5" cy="35.3" r="0.5" fill="#fff7d8" opacity="0.85" />
        </motion.g>
      </motion.g>

      {/* Legs / feet — only when perched */}
      {!flying && (
        <g stroke="#050505" strokeWidth="1.4" strokeLinecap="round">
          <line x1="50" y1="71" x2="50" y2="84" />
          <line x1="62" y1="71" x2="62" y2="84" />
          <line x1="46" y1="84" x2="55" y2="84" />
          <line x1="58" y1="84" x2="67" y2="84" />
        </g>
      )}
    </motion.svg>
  );
}
