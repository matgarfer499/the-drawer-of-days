import { content } from "@content";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { mulberry32 } from "@shared/lib/seededRotation";
import { useMemo, useRef } from "react";
import type { Points } from "three";

/**
 * The finale's paper sky — the project's ONLY WebGL. A field of phosphorescent
 * paper stars, seeded so it's stable, drifting slowly with a contained bloom for
 * the glow. Lazy-loaded (its own chunk, never on first paint) and mounted only
 * while the finale is open under full motion; reduced motion skips it entirely
 * and the 2D finale stands on its own. Decorative — the canvas is aria-hidden and
 * the real content (photos, thesis) lives in the DOM above it.
 */

const STAR_COUNT = 64;
/** golden-hour token value — WebGL needs a literal colour, not a CSS class */
const STAR_COLOR = "#e3b055";

function Stars() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const rng = mulberry32(content.seed >>> 0);
    const array = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i += 1) {
      array[i * 3] = (rng() * 2 - 1) * 6;
      array[i * 3 + 1] = (rng() * 2 - 1) * 4;
      array[i * 3 + 2] = -rng() * 4;
    }
    return array;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        sizeAttenuation
        transparent
        depthWrite={false}
        color={STAR_COLOR}
      />
    </points>
  );
}

export default function FinaleSky() {
  return (
    <div className="pointer-events-none fixed inset-0 bg-night-paper" aria-hidden="true">
      <Canvas
        frameloop="always"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
      >
        <Stars />
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.1} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
