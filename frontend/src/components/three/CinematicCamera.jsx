import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

// Smoothstep helper
const smooth = (a, b, t) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const lerp = (a, b, t) => a + (b - a) * t;

// Cinematic camera that progresses through timed phases.
// elapsed (seconds) is owned outside so parent can show/hide UI in sync.
export default function CinematicCamera({ elapsed, started }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 1.5, z: 0 });

  useFrame(() => {
    if (!started) {
      // Sit outside the door, gentle idle
      const wobble = Math.sin(performance.now() * 0.0006) * 0.04;
      camera.position.set(wobble, 1.7, 11.2);
      camera.lookAt(0, 1.7, 9);
      return;
    }

    const T = elapsed;

    // Phase A (0 – 1.4s): door opens, camera nudges slightly forward
    // Phase B (1.4 – 4.2s): walk forward, head bob
    // Phase C (4.2 – 5.6s): pause in front of panel (subtitle plays)
    // Phase D (5.6 – 7.0s): sit down (lower y, slight pitch up)
    // Phase E (7.0+):       settled, micro-sway

    // Z position
    let z;
    if (T < 1.4) z = lerp(11.2, 10.5, smooth(0, 1.4, T));
    else if (T < 4.2) z = lerp(10.5, 3.0, smooth(1.4, 4.2, T));
    else if (T < 5.6) z = 3.0;
    else if (T < 7.0) z = lerp(3.0, 2.6, smooth(5.6, 7.0, T));
    else z = 2.6;

    // Y position — walking height, then sit
    let y;
    if (T < 5.6) y = 1.7;
    else if (T < 7.0) y = lerp(1.7, 1.12, smooth(5.6, 7.0, T));
    else y = 1.12;

    // Head bob during walk
    let bob = 0;
    let sway = 0;
    if (T > 1.4 && T < 4.2) {
      bob = Math.sin((T - 1.4) * 6.5) * 0.04;
      sway = Math.sin((T - 1.4) * 3.2) * 0.06;
    }
    // Settled micro-sway
    if (T > 7.0) {
      sway = Math.sin(T * 1.1) * 0.015;
      bob = Math.sin(T * 0.9) * 0.008;
    }

    camera.position.set(sway, y + bob, z);

    // Look target — at panel chairperson; pitch up when sitting
    const lookY = T < 5.6 ? 1.7 : lerp(1.7, 1.95, smooth(5.6, 7.0, T));
    const lookZ = -2.6;
    target.current.x += (0 - target.current.x) * 0.1;
    target.current.y += (lookY - target.current.y) * 0.1;
    target.current.z += (lookZ - target.current.z) * 0.1;
    camera.lookAt(target.current.x, target.current.y, target.current.z);
  });

  return null;
}
