import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { lazy, Suspense } from "react";

// The WebGL paper sky is its own chunk, imported only when this renders it — so
// three/R3F never ships in the initial bundle.
const FinaleSky = lazy(() => import("@scenes/finale-double-bottom/FinaleSky"));

/**
 * Persistent WebGL mount point, mounted once in `App`. It renders the finale's
 * paper-sky canvas only while the finale is open under full motion; everywhere
 * else (and under reduced motion) it is nothing, so WebGL never loads on first
 * paint and the 2D finale remains a complete fallback. The Suspense fallback is a
 * plain night surface, so the backdrop is dark from the first frame.
 */
export function CanvasLayer() {
  const status = useExperienceStore((state) => state.status);
  const reduced = useReducedMotion() ?? false;

  if (status !== "finale" || reduced) return null;

  return (
    <Suspense fallback={<div className="pointer-events-none fixed inset-0 bg-night-paper" />}>
      <FinaleSky />
    </Suspense>
  );
}
