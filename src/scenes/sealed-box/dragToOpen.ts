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
 * Did this drag release pull the ribbon hard or far enough to open the box?
 * Direction-agnostic (you can tug the bow either way) and forgiving — a quick
 * flick counts even if short, which feels right on a phone.
 */
export function shouldOpenFromDrag(release: DragRelease, opts: DragToOpenOptions = {}): boolean {
  const { distance = 72, velocity = 480 } = opts;
  return Math.abs(release.offset) >= distance || Math.abs(release.velocity) >= velocity;
}
