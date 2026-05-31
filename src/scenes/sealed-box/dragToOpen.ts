export interface DragRelease {
  /** net displacement along the pull axis, in px */
  offset: number;
  /** release velocity along the pull axis, in px/s */
  velocity: number;
}

export interface DragToOpenOptions {
  /** how far you must pull before the bow gives (px) */
  distance?: number;
  /** a quick flick opens it even if short (px/s) */
  velocity?: number;
}

/**
 * Did this drag release pull hard or far enough to act? Direction-agnostic (you
 * can tug either way) and forgiving — a quick flick counts even if short, which
 * feels right on a phone.
 */
export function shouldOpenFromDrag(release: DragRelease, opts: DragToOpenOptions = {}): boolean {
  const { distance = 72, velocity = 480 } = opts;
  return Math.abs(release.offset) >= distance || Math.abs(release.velocity) >= velocity;
}

/**
 * The two-phase opening gesture. `untying` and `lifting` are *transient* states
 * the scene sets while an animation plays — they are not gesture targets, so a
 * release during them is ignored.
 */
export type BoxPhase = "tied" | "untying" | "untied" | "lifting";

/** Pull the knot sideways to untie — a touch easier than lifting the lid. */
export const UNTIE_THRESHOLD: DragToOpenOptions = { distance: 64, velocity: 420 };
/** Lift the lid upward to open. */
export const LIFT_THRESHOLD: DragToOpenOptions = { distance: 72, velocity: 480 };

/**
 * Pure phase machine for a drag release: `tied` → `untying` once the knot is
 * pulled enough, `untied` → `lifting` once the lid is lifted enough. Every other
 * phase (including the transient ones) returns unchanged.
 */
export function nextPhase(phase: BoxPhase, release: DragRelease): BoxPhase {
  if (phase === "tied") {
    return shouldOpenFromDrag(release, UNTIE_THRESHOLD) ? "untying" : "tied";
  }
  if (phase === "untied") {
    return shouldOpenFromDrag(release, LIFT_THRESHOLD) ? "lifting" : "untied";
  }
  return phase;
}
