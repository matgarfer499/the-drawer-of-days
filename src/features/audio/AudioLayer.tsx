/**
 * Persistent audio mount point. Mounted once in `App` so the (future) Howler
 * AudioEngine singleton survives every scene change — the core reason this is a
 * SPA. Phase 1 is a placeholder; the engine, the gesture unlock and the finale
 * song arrive with the `audio-howler` skill. See ROADMAP §4 / phase 8.
 */
export function AudioLayer(): null {
  return null;
}
