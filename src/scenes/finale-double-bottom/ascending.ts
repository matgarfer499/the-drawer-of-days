import { mulberry32 } from "@shared/lib/seededRotation";

/**
 * Where the ascending polaroids start and when each one lifts off. Seeded so the
 * rise is hand-scattered yet identical across renders (the 2D collage fallback and
 * the 3D rise read the same layout). Pure — no DOM, no motion.
 */

export interface AscendingItem {
  /** horizontal start, viewport % within the safe margins (15–85) */
  x: number;
  /** lift-off delay in seconds — strictly increasing so they rise in sequence */
  delay: number;
  /** tilt in degrees, within ±8 */
  rotate: number;
}

export function ascendingLayout(count: number, seed: number): AscendingItem[] {
  const rng = mulberry32(seed >>> 0);
  const items: AscendingItem[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = 15 + rng() * 70;
    const rotate = (rng() * 2 - 1) * 8;
    // index dominates the jitter (0.5 step > 0.4 max), so delays always ascend
    const delay = i * 0.5 + rng() * 0.4;
    items.push({ x, delay, rotate });
  }
  return items;
}
