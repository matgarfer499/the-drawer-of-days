import type { Constellation, SkyNode } from "@content";

/**
 * Pure logic for the paper sky. Stars are lit by tapping; a constellation is
 * "drawn" once all of its stars are lit, and the hidden message is traced once
 * every constellation is complete. No DOM, no motion — the playful state is
 * unit-tested. Joining is forgiving by design: lighting any star always helps,
 * nothing can be done "wrong".
 */

export interface SkyPoint {
  x: number;
  y: number;
}

/** Every one of a constellation's stars is lit. */
export function isConstellationComplete(
  constellation: Constellation,
  lit: ReadonlySet<string>,
): boolean {
  return constellation.starIds.length > 0 && constellation.starIds.every((id) => lit.has(id));
}

export interface SkyProgress {
  /** constellations fully lit, in input order */
  completed: Constellation[];
  /** there are constellations and every one is complete */
  allComplete: boolean;
}

export function skyProgress(
  lit: ReadonlySet<string>,
  constellations: readonly Constellation[],
): SkyProgress {
  const completed = constellations.filter((c) => isConstellationComplete(c, lit));
  return {
    completed,
    allComplete: constellations.length > 0 && completed.length === constellations.length,
  };
}

/** The constellation's stars as points (viewport %), in `starIds` order, skipping any unknown id. */
export function constellationPoints(
  constellation: Constellation,
  nodeById: ReadonlyMap<string, SkyNode>,
): SkyPoint[] {
  return constellation.starIds
    .map((id) => nodeById.get(id))
    .filter((node): node is SkyNode => node !== undefined)
    .map((node) => ({ x: node.position.x, y: node.position.y }));
}
