/**
 * Persistent WebGL mount point. Mounted once in `App` so the react-three-fiber
 * canvas (used ONLY in the finale's paper sky) can persist and be lazy-loaded
 * without remounting per scene. Phase 1 is a placeholder; the lazy R3F scene
 * arrives with the `r3f-paper-sky` skill. See ROADMAP §4 / phase 8.
 */
export function CanvasLayer(): null {
  return null;
}
