import { hashId, mulberry32 } from "./seededRotation";

export interface Point {
  x: number;
  y: number;
}

export interface StitchPathOptions {
  /** maximum perpendicular sag of the thread, in viewBox units */
  maxSag?: number;
  /** global seed mixed in so the whole layout can be reshuffled at once */
  seed?: number;
}

const f = (n: number): string => n.toFixed(2);

/**
 * SVG path for a sewn red thread between two points: a quadratic curve whose
 * control point sags perpendicular to the segment by a seeded amount, so each
 * stitch droops a little differently yet stays IDENTICAL across renders.
 */
export function stitchPath(
  from: Point,
  to: Point,
  id: string,
  opts: StitchPathOptions = {},
): string {
  const { maxSag = 6, seed = 0 } = opts;
  const start = `M ${f(from.x)} ${f(from.y)}`;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return start;

  const rng = mulberry32(hashId(id) ^ (seed >>> 0));
  const sag = (rng() * 2 - 1) * maxSag;
  // unit vector perpendicular to the segment
  const px = -dy / len;
  const py = dx / len;
  const cx = (from.x + to.x) / 2 + px * sag;
  const cy = (from.y + to.y) / 2 + py * sag;
  return `${start} Q ${f(cx)} ${f(cy)} ${f(to.x)} ${f(to.y)}`;
}
