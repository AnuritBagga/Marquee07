/* eslint-disable react/no-unknown-property */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Panelist from "./Panelist";

export default function InterviewRoom({ doorOpen = 0, subtitle = "", chairpersonPortrait }) {
  const door = useRef();
  const candle1 = useRef();
  const candle2 = useRef();
  const flicker = useRef(0);

  useFrame((_, delta) => {
    // Door swings open: 0 (closed) → 1 (fully open ~ -100°)
    if (door.current) {
      const target = -doorOpen * (Math.PI * 0.62);
      door.current.rotation.y += (target - door.current.rotation.y) * 0.12;
    }
    // Candle flicker
    flicker.current += delta;
    const f = 1 + Math.sin(flicker.current * 8) * 0.15 + Math.random() * 0.08;
    if (candle1.current) candle1.current.intensity = 2.4 * f;
    if (candle2.current) candle2.current.intensity = 2.4 * (1 + Math.cos(flicker.current * 7.3) * 0.18);
  });

  // Static decorative geometry pre-computed
  const ceilingBeams = useMemo(
    () => [-3, -1.5, 0, 1.5, 3].map((x) => x),
    [],
  );

  return (
    <group>
      {/* ──────────────── ENVIRONMENT ──────────────── */}
      {/* Floor — dark stained wood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 24]} />
        <meshStandardMaterial color="#1c1410" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Subtle floor inlay strip (gold) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[2.3, 2.4, 64]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.15} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
        <planeGeometry args={[16, 24]} />
        <meshStandardMaterial color="#080606" roughness={1} />
      </mesh>

      {/* Ceiling beams */}
      {ceilingBeams.map((x) => (
        <mesh key={x} position={[x, 4.35, 0]}>
          <boxGeometry args={[0.18, 0.18, 24]} />
          <meshStandardMaterial color="#1a0e0a" roughness={1} />
        </mesh>
      ))}

      {/* Back wall (behind panel) */}
      <mesh position={[0, 2.25, -5]}>
        <planeGeometry args={[16, 4.5]} />
        <meshStandardMaterial color="#161013" roughness={0.95} />
      </mesh>

      {/* Side walls */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-6, 2.25, 0]}>
        <planeGeometry args={[24, 4.5]} />
        <meshStandardMaterial color="#13100e" roughness={0.95} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[6, 2.25, 0]}>
        <planeGeometry args={[24, 4.5]} />
        <meshStandardMaterial color="#13100e" roughness={0.95} />
      </mesh>

      {/* Front wall (with door cut-out approximation) — two panels flanking */}
      <mesh position={[-3.5, 2.25, 9]}>
        <planeGeometry args={[5, 4.5]} />
        <meshStandardMaterial color="#13100e" roughness={0.95} />
      </mesh>
      <mesh position={[3.5, 2.25, 9]}>
        <planeGeometry args={[5, 4.5]} />
        <meshStandardMaterial color="#13100e" roughness={0.95} />
      </mesh>
      {/* lintel above door */}
      <mesh position={[0, 4, 9]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color="#13100e" roughness={0.95} />
      </mesh>

      {/* ──────────────── CORRIDOR (camera side) ──────────────── */}
      {/* Corridor floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 14]} receiveShadow>
        <planeGeometry args={[8, 10]} />
        <meshStandardMaterial color="#0f0a08" roughness={0.9} />
      </mesh>
      {/* Corridor side walls */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-4, 2.25, 14]}>
        <planeGeometry args={[10, 4.5]} />
        <meshStandardMaterial color="#0c0805" roughness={1} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[4, 2.25, 14]}>
        <planeGeometry args={[10, 4.5]} />
        <meshStandardMaterial color="#0c0805" roughness={1} />
      </mesh>
      {/* Corridor ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 14]}>
        <planeGeometry args={[8, 10]} />
        <meshStandardMaterial color="#070504" roughness={1} />
      </mesh>
      {/* Corridor end wall (behind camera-start) */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 2.25, 18.5]}>
        <planeGeometry args={[8, 4.5]} />
        <meshStandardMaterial color="#0a0706" roughness={1} />
      </mesh>
      {/* Corridor brass sconces */}
      <mesh position={[-3.8, 2.6, 13]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[3.8, 2.6, 13]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[-3.6, 2.8, 13]} color="#f5c66b" intensity={1.6} distance={7} decay={2} />
      <pointLight position={[3.6, 2.8, 13]} color="#f5c66b" intensity={1.6} distance={7} decay={2} />
      {/* Soft fill above door */}
      <pointLight position={[0, 4.0, 11]} color="#f1c585" intensity={1.2} distance={6} decay={2} />
      {/* Cool fill from behind to rim-light the back of the door frame */}
      <pointLight position={[0, 2, 16.5]} color="#6a8ab8" intensity={0.6} distance={8} decay={2} />

      {/* ──────────────── DOOR ──────────────── */}
      {/* Door frame */}
      <mesh position={[-1, 1.75, 9]}>
        <boxGeometry args={[0.08, 3.5, 0.18]} />
        <meshStandardMaterial color="#0a0606" roughness={0.9} />
      </mesh>
      <mesh position={[1, 1.75, 9]}>
        <boxGeometry args={[0.08, 3.5, 0.18]} />
        <meshStandardMaterial color="#0a0606" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.5, 9]}>
        <boxGeometry args={[2.1, 0.08, 0.18]} />
        <meshStandardMaterial color="#0a0606" roughness={0.9} />
      </mesh>

      {/* Hinged door — group at hinge (x = -1), mesh offset +1 */}
      <group ref={door} position={[-1, 1.75, 9]}>
        <mesh position={[1, 0, 0]} castShadow>
          <boxGeometry args={[2, 3.4, 0.08]} />
          <meshStandardMaterial color="#3a1f12" roughness={0.65} metalness={0.1} />
        </mesh>
        {/* Door inset panels */}
        <mesh position={[1, 0.7, 0.045]}>
          <boxGeometry args={[1.5, 1.2, 0.02]} />
          <meshStandardMaterial color="#1f0f08" roughness={0.7} />
        </mesh>
        <mesh position={[1, -0.7, 0.045]}>
          <boxGeometry args={[1.5, 1.2, 0.02]} />
          <meshStandardMaterial color="#1f0f08" roughness={0.7} />
        </mesh>
        {/* Brass handle */}
        <mesh position={[1.75, 0, 0.06]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {/* Spill of warm corridor light when door opens */}
      <pointLight
        position={[0, 1.7, 9.4]}
        intensity={Math.max(0, doorOpen) * 2.2}
        color="#f5c66b"
        distance={6}
        decay={2}
      />

      {/* ──────────────── TABLE ──────────────── */}
      <mesh position={[0, 0.85, -2]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.12, 1.6]} />
        <meshStandardMaterial color="#2a1810" roughness={0.45} metalness={0.15} />
      </mesh>
      {/* Table front skirt */}
      <mesh position={[0, 0.5, -1.25]}>
        <boxGeometry args={[6, 0.55, 0.08]} />
        <meshStandardMaterial color="#1c0f08" roughness={0.7} />
      </mesh>
      {/* Table legs */}
      {[[-2.8, -2.7], [2.8, -2.7], [-2.8, -1.3], [2.8, -1.3]].map(([x, z]) => (
        <mesh key={`${x},${z}`} position={[x, 0.4, z]} castShadow>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
          <meshStandardMaterial color="#0a0604" roughness={0.9} />
        </mesh>
      ))}

      {/* ──────────────── PANELISTS ──────────────── */}
      <Panelist position={[-1.8, 0.55, -2.4]} seed={0.7} />
      <Panelist position={[0, 0.55, -2.6]} seed={1.4} accent />
      <Panelist position={[1.8, 0.55, -2.4]} seed={2.1} />

      {/* ──────────────── CANDIDATE CHAIR ──────────────── */}
      <mesh position={[0, 0.45, 2.6]} castShadow>
        <boxGeometry args={[1.0, 0.1, 0.9]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.0, 3.0]} castShadow>
        <boxGeometry args={[1.0, 1.2, 0.1]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.7} />
      </mesh>

      {/* Floor lamp / sconce candles near back wall */}
      <mesh position={[-4, 2.4, -4.9]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[4, 2.4, -4.9]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.8} />
      </mesh>
      <pointLight ref={candle1} position={[-4, 2.7, -4.6]} color="#f5c66b" intensity={2.4} distance={6} decay={2} />
      <pointLight ref={candle2} position={[4, 2.7, -4.6]} color="#f5c66b" intensity={2.4} distance={6} decay={2} />

      {/* Key spotlight on the panel (warm gold) — using a pointLight above the table */}
      <pointLight
        position={[0, 3.4, -2.2]}
        intensity={6.5}
        color="#f3d28a"
        distance={9}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Side accents on panel */}
      <pointLight position={[-2.6, 3.0, -2.0]} intensity={2.2} color="#e6c075" distance={5} decay={2} />
      <pointLight position={[2.6, 3.0, -2.0]} intensity={2.2} color="#e6c075" distance={5} decay={2} />

      {/* Cool rim light from the candidate side */}
      <pointLight position={[0, 3.0, 2.0]} intensity={1.6} color="#7a9bcb" distance={7} decay={2} />

      {/* General directional fill from above (so geometry isn't pitch black) */}
      <directionalLight position={[2, 8, 4]} intensity={0.55} color="#fff1d6" />
      <directionalLight position={[-3, 6, -3]} intensity={0.35} color="#caa86a" />

      {/* Ambient fill */}
      <ambientLight intensity={0.55} color="#3a2818" />

      {/* Coat of arms / emblem over back wall */}
      <mesh position={[0, 3.3, -4.95]}>
        <ringGeometry args={[0.42, 0.5, 32]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 3.3, -4.94]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial color="#0a0606" roughness={0.95} />
      </mesh>

      {/* Floating subtitle is now rendered as an HTML overlay by parent */}

      {/* Atmospheric fog disabled here — set on scene via parent */}
    </group>
  );
}
