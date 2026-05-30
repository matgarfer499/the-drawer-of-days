import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { Component, lazy, type ReactNode, Suspense } from "react";

// The WebGL paper sky is its own chunk, imported only when this renders it — so
// three/R3F never ships in the initial bundle.
const FinaleSky = lazy(() => import("@scenes/finale-double-bottom/FinaleSky"));

/** A plain dark surface — the backdrop while the chunk loads or if it can't. */
function NightSurface() {
  return <div className="pointer-events-none fixed inset-0 bg-night-paper" />;
}

/**
 * Keeps a chunk-load failure (or any WebGL error) from taking down the app: the
 * finale is `bare`, so without this a thrown FinaleSky would leave the 2D finale
 * with nothing behind it — and an unhandled lazy rejection crashes the tree. We
 * degrade to the night surface and the 2D finale keeps standing.
 */
class SkyBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? <NightSurface /> : this.props.children;
  }
}

/**
 * Persistent WebGL mount point, mounted once in `App`. It renders the finale's
 * paper-sky canvas only while the finale is open under full motion; everywhere
 * else (and under reduced motion) it is nothing, so WebGL never loads on first
 * paint and the 2D finale remains a complete fallback.
 */
export function CanvasLayer() {
  const status = useExperienceStore((state) => state.status);
  const reduced = useReducedMotion() ?? false;

  if (status !== "finale" || reduced) return null;

  return (
    <SkyBoundary>
      <Suspense fallback={<NightSurface />}>
        <FinaleSky />
      </Suspense>
    </SkyBoundary>
  );
}
