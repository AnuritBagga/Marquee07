/* eslint-disable react/no-unknown-property */
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";

/**
 * PortraitPanelist — a panelist whose face is a textured plane (real photo).
 * Body remains as a charcoal suit cylinder, but the head sphere is replaced
 * with a billboard plane showing the portrait. Animates with breathing and
 * subtle head sway. Used for the chairperson during the walk-in cinematic.
 */
export default function PortraitPanelist({
  position = [0, 0, 0],
  portraitUrl,
  seed = 0,
  accent = false,
}) {
  const tex = useLoader(TextureLoader, portraitUrl);
  // Ensure correct color space so the photo doesn't look washed out
  if (tex && tex.colorSpace !== SRGBColorSpace) {
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
  }

  const face = useRef();
  const body = useRef();
  const t0 = useRef(seed);

  useFrame((_, delta) => {
    t0.current += delta;
    const t = t0.current;
    if (face.current) {
      face.current.rotation.y = Math.sin(t * 0.4 + seed) * 0.05;
      face.current.rotation.x = Math.sin(t * 0.3 + seed * 2) * 0.025;
      face.current.position.y = 2.3 + Math.sin(t * 1.2 + seed) * 0.012;
    }
    if (body.current) {
      body.current.scale.y = 1 + Math.sin(t * 1.2 + seed) * 0.006;
    }
  });

  return (
    <group position={position}>
      {/* Chair */}
      <mesh position={[0, 1.05, -0.45]} castShadow>
        <boxGeometry args={[1.15, 1.7, 0.12]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, -0.2]} castShadow>
        <boxGeometry args={[1.05, 0.12, 0.7]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.65} />
      </mesh>

      {/* Suit body */}
      <mesh ref={body} position={[0, 1.4, -0.18]} castShadow>
        <cylinderGeometry args={[0.45, 0.6, 1.55, 24]} />
        <meshStandardMaterial color="#1c1a1d" roughness={0.85} />
      </mesh>

      {/* Lapel triangle */}
      <mesh position={[0, 1.7, 0.18]} rotation={[0.05, 0, 0]}>
        <coneGeometry args={[0.2, 0.5, 4]} />
        <meshStandardMaterial color="#f7f1e3" roughness={0.7} />
      </mesh>

      {/* Royal pin */}
      {accent && (
        <mesh position={[0.2, 1.8, 0.35]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={0.7}
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
      )}

      {/* Face — textured plane, lit by scene */}
      <mesh ref={face} position={[0, 2.3, 0.12]}>
        <planeGeometry args={[0.7, 0.85]} />
        <meshStandardMaterial
          map={tex}
          transparent
          roughness={0.55}
          metalness={0.0}
          alphaTest={0.05}
        />
      </mesh>
    </group>
  );
}
