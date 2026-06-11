import { hashId, mulberry32 } from "@shared/lib/seededRotation";

export interface HubPoint {
  /** horizontal centre, as a percentage of the hub (0–100) */
  x: number;
  /** vertical centre, as a percentage of the hub (0–100) */
  y: number;
}

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/**
 * Deterministic mobile-first collage layout for the hub objects: a gentle
 * vertical zigzag (alternating sides of centre) with a seeded jitter, so the
 * objects look hand-placed yet stable and never overlap. Centres are percentages
 * of the hub, which also feed the red thread between opened objects.
 */
export function hubLayout(count: number, seed = 0): HubPoint[] {
  if (count <= 0) return [];
  const rng = mulberry32(seed >>> 0);
  const top = 14;
  // keep keepsakes clear of the bottom controls (finale gate / tour)
  const bottom = 76;
  const center = 50;
  const amplitude = 20;
  const jitter = 5;
  const span = bottom - top;

  const points: HubPoint[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const side = i % 2 === 0 ? -1 : 1;
    const x = center + side * amplitude + (rng() * 2 - 1) * jitter;
    const y = top + t * span + (rng() * 2 - 1) * jitter;
    points.push({ x: clamp(x, 14, 86), y: clamp(y, 12, 88) });
  }
  return points;
}

/**
 * CSS custom properties for a hub object's centre — the same sanctioned
 * inline-style exception as seededTransformVars, for data-driven layout that no
 * static class can express. Consume via `left-[var(--hub-x)] top-[var(--hub-y)]`.
 */
export function hubPositionVars(point: HubPoint): Record<`--${string}`, string> {
  return { "--hub-x": `${point.x.toFixed(2)}%`, "--hub-y": `${point.y.toFixed(2)}%` };
}

/**
 * Delay (in seconds) before a keepsake settles into the box on the hub's first
 * reveal: a cascade down the zigzag with a seeded jitter so the drop never feels
 * mechanical. Deterministic — same id + seed → identical choreography.
 */
export function hubEntryDelay(id: string, index: number, seed = 0): number {
  const jitter = mulberry32(hashId(id) ^ (seed >>> 0))() * 0.08;
  return 0.15 + index * 0.07 + jitter;
}
