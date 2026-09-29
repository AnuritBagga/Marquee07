import { motion } from "framer-motion";
import lionLg from "@/assets/brand/lion-mascot-lg.png";
import lionMd from "@/assets/brand/lion-mascot-md.png";
import lionSm from "@/assets/brand/lion-mascot-sm.png";

export default function Lion({
  size = 32,
  flip = false, // Changed default to false for correct direction
  glow = false,
  animate = false,
  className = "",
  testId = "marquee-lion",
}) {
  const src = size <= 48 ? lionSm : size <= 200 ? lionMd : lionLg;
  const height = Math.round(size / 0.77);

  // Enhanced animation variants
  const glowVariants = {
    initial: { scale: 1, opacity: 0.15 },
    animate: {
      scale: [1, 1.3, 1.1, 1],
      opacity: [0.15, 0.4, 0.25, 0.15],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.4, 0.7, 1],
      },
    },
  };

  const lionVariants = {
    initial: { 
      scale: 1, 
      rotate: 0,
      y: 0,
    },
    hover: {
      scale: 1.15,
      rotate: [0, -8, 8, -5, 5, 0],
      y: [-2, -4, -2],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Entry animation for the lion
  const entryVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5, 
      rotate: -20,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1,
      },
    },
  };

  return (
    <motion.span
      data-testid={testId}
      className={`relative inline-block ${className}`}
      style={{ width: size, height }}
      initial={animate ? "hidden" : "initial"}
      animate={animate ? "visible" : "initial"}
      whileHover={animate ? "hover" : undefined}
      whileTap={animate ? "tap" : undefined}
      variants={animate ? entryVariants : {}}
    >
      {glow && (
        <>
          {/* Primary glow */}
          <motion.span
            className="absolute inset-0 -m-4 rounded-full bg-[#D4AF37]/20 blur-xl"
            aria-hidden="true"
            variants={animate ? glowVariants : {}}
            initial="initial"
            animate={animate ? "animate" : undefined}
          />
          {/* Secondary glow for depth */}
          <motion.span
            className="absolute inset-0 -m-2 rounded-full bg-[#D4AF37]/10 blur-2xl"
            aria-hidden="true"
            variants={animate ? glowVariants : {}}
            initial="initial"
            animate={animate ? "animate" : undefined}
            style={{
              animationDelay: "0.5s",
            }}
          />
        </>
      )}
      <motion.img
        src={src}
        alt="Marquee lion mark"
        width={size}
        height={height}
        draggable={false}
        className="relative select-none"
        style={{
          width: size,
          height,
          transform: flip ? "scaleX(-1)" : "none",
          filter: "drop-shadow(0 2px 10px rgba(212,175,55,0.25))",
        }}
        variants={animate ? lionVariants : {}}
      />
    </motion.span>
  );
}