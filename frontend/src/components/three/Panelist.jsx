/* eslint-disable react/no-unknown-property */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// One stylized panelist: charcoal cylindrical body, neutral head, gold pin.
// Subtle breathing + occasional head tilt for "life".
export default function Panelist({ position = [0, 0, 0], seed = 0, accent = false }) {
  const head = useRef();
  const body = useRef();
  const t0 = useRef(seed);

  useFrame((_, delta) => {
    t0.current += delta;
    const t = t0.current;
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.4 + seed) * 0.08;
      head.current.rotation.x = Math.sin(t * 0.3 + seed * 2) * 0.04;
      head.current.position.y = 2.2 + Math.sin(t * 1.2 + seed) * 0.012;
    }
    if (body.current) {
      body.current.scale.y = 1 + Math.sin(t * 1.2 + seed) * 0.006;
    }
  });

  return (
    <group position={position}>
      {/* Chair back */}
      <mesh position={[0, 1.05, -0.45]} castShadow>
        <boxGeometry args={[1.1, 1.6, 0.12]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Seat (hidden behind table) */}
      <mesh position={[0, 0.55, -0.2]} castShadow>
        <boxGeometry args={[1.0, 0.12, 0.7]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.6} />
      </mesh>

      {/* Body — suit cylinder, slightly tapered (cone-ish) */}
      <mesh ref={body} position={[0, 1.35, -0.18]} castShadow>
        <cylinderGeometry args={[0.42, 0.55, 1.4, 24]} />
        <meshStandardMaterial color="#1a1a1c" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Lapel / shirt triangle */}
      <mesh position={[0, 1.62, 0.16]} rotation={[0.05, 0, 0]}>
        <coneGeometry args={[0.18, 0.45, 4]} />
        <meshStandardMaterial color="#f5efe4" roughness={0.7} />
      </mesh>

      {/* Royal pin (only on the chairperson) */}
      {accent && (
        <mesh position={[0.18, 1.7, 0.32]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={0.6}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      )}

      {/* Neck */}
      <mesh position={[0, 1.97, -0.05]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 0.22, 16]} />
        <meshStandardMaterial color="#2a201a" roughness={0.7} />
      </mesh>

      {/* Head */}
      <mesh ref={head} position={[0, 2.2, -0.02]} castShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color="#3a2e25"
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
