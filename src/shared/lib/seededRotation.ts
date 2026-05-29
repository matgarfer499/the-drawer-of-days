/**
 * Deterministic "handmade imperfection" for scrapbook props.
 *
 * Every piece of prop art (a polaroid, a strip of washi tape, a stamp) gets a tiny
 * rotation/offset derived from its `id`, so it looks hand-placed yet stays IDENTICAL
 * across renders. Ported from physics_app's seeded fracture (engine/fracture.ts).
 */

/** mulberry32 — tiny, fast, dependency-free PRNG. Deterministic [0, 1) per seed. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string id into a 32-bit unsigned seed (FNV-1a). */
export function hashId(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface SeededTransform {
  /** rotation in degrees, within [-maxRotation, +maxRotation] */
  rotation: number;
  /** horizontal offset in px, within [-maxOffset, +maxOffset] */
  offsetX: number;
  /** vertical offset in px, within [-maxOffset, +maxOffset] */
  offsetY: number;
}

export interface SeededTransformOptions {
  maxRotation?: number;
  maxOffset?: number;
  /** global seed mixed in so the whole collage can be reshuffled at once */
  seed?: number;
}

/** Stable per-id transform. Same id (+ global seed) → identical result every render. */
export function seededTransform(id: string, opts: SeededTransformOptions = {}): SeededTransform {
  const { maxRotation = 4, maxOffset = 3, seed = 0 } = opts;
  const rng = mulberry32(hashId(id) ^ (seed >>> 0));
  return {
    rotation: (rng() * 2 - 1) * maxRotation,
    offsetX: (rng() * 2 - 1) * maxOffset,
    offsetY: (rng() * 2 - 1) * maxOffset,
  };
}

/**
 * CSS custom properties for a seeded transform — the sanctioned exception to the
 * "no inline style" rule. Consume them from Tailwind arbitrary values, e.g.
 * `rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)]`.
 */
export function seededTransformVars(
  id: string,
  opts?: SeededTransformOptions,
): Record<`--${string}`, string> {
  const t = seededTransform(id, opts);
  return {
    "--seed-rot": `${t.rotation.toFixed(2)}deg`,
    "--seed-x": `${t.offsetX.toFixed(1)}px`,
    "--seed-y": `${t.offsetY.toFixed(1)}px`,
  };
}
