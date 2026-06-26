import { useEffect, useState } from "react";
import { audioEngine } from "./AudioEngine";

export interface TrackProgress {
  /** seconds elapsed, >= 0 */
  readonly position: number;
  /** total seconds, 0 while unknown (html5 metadata not loaded yet) */
  readonly duration: number;
}

const POLL_MS = 250; // ~4 reads/sec — smooth enough for the bar, cheap on re-renders

/**
 * Position/duration for the scrubber. Polls the engine via `requestAnimationFrame`
 * ONLY while a track is playing, throttled to ~4 Hz, and tears the loop down on
 * pause/unmount. It never goes through the PlaylistSnapshot/useSyncExternalStore —
 * that heavy subscription stays free of per-frame churn. Re-reads immediately when
 * the track (`index`) changes or after a scrub commit (`seekTick`) so a paused seek
 * still reflects at once.
 *
 * Lives inside the expanded subtree, so it doesn't even run while the island is mini.
 */
export function useTrackProgress(playing: boolean, index: number, seekTick: number): TrackProgress {
  const [progress, setProgress] = useState<TrackProgress>({ position: 0, duration: 0 });

  // `index` and `seekTick` aren't read in the effect — they're deliberate retrigger
  // deps: a new track or a committed seek must force a fresh read (and restart the loop).
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional retrigger deps
  useEffect(() => {
    // One immediate read covers paused state, a fresh track, and a just-committed seek.
    setProgress({ position: audioEngine.getPosition(), duration: audioEngine.getDuration() });
    if (!playing) return;

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < POLL_MS) return;
      last = now;
      setProgress({ position: audioEngine.getPosition(), duration: audioEngine.getDuration() });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, index, seekTick]);

  return progress;
}
