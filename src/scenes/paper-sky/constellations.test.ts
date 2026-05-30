import type { Constellation, SkyNode } from "@content";
import { describe, expect, it } from "vitest";
import { constellationPoints, isConstellationComplete, skyProgress } from "./constellations";

const node = (id: string, x: number, y: number): SkyNode => ({
  id,
  label: id,
  position: { x, y },
});
const constellation = (id: string, starIds: string[]): Constellation => ({ id, name: id, starIds });

describe("isConstellationComplete", () => {
  it("is true only when every star is lit", () => {
    const c = constellation("a", ["s1", "s2"]);
    expect(isConstellationComplete(c, new Set(["s1", "s2"]))).toBe(true);
    expect(isConstellationComplete(c, new Set(["s1"]))).toBe(false);
    expect(isConstellationComplete(c, new Set())).toBe(false);
  });
});

describe("skyProgress", () => {
  const cons = [constellation("a", ["s1", "s2"]), constellation("b", ["s3", "s4"])];

  it("reports no completion before any star is lit", () => {
    const p = skyProgress(new Set(), cons);
    expect(p.completed).toEqual([]);
    expect(p.allComplete).toBe(false);
  });

  it("completes one constellation without claiming them all", () => {
    const p = skyProgress(new Set(["s1", "s2"]), cons);
    expect(p.completed.map((c) => c.id)).toEqual(["a"]);
    expect(p.allComplete).toBe(false);
  });

  it("flags allComplete only when every constellation is drawn", () => {
    const p = skyProgress(new Set(["s1", "s2", "s3", "s4"]), cons);
    expect(p.completed.map((c) => c.id)).toEqual(["a", "b"]);
    expect(p.allComplete).toBe(true);
  });

  it("never reports allComplete when there are no constellations", () => {
    expect(skyProgress(new Set(["s1"]), []).allComplete).toBe(false);
  });
});

describe("constellationPoints", () => {
  const nodes = new Map([
    ["s1", node("s1", 10, 20)],
    ["s2", node("s2", 30, 40)],
  ]);

  it("returns the stars' points in starIds order", () => {
    expect(constellationPoints(constellation("a", ["s1", "s2"]), nodes)).toEqual([
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ]);
    expect(constellationPoints(constellation("a", ["s2", "s1"]), nodes)).toEqual([
      { x: 30, y: 40 },
      { x: 10, y: 20 },
    ]);
  });

  it("skips a star id that has no node", () => {
    expect(constellationPoints(constellation("a", ["s1", "missing", "s2"]), nodes)).toEqual([
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ]);
  });
});
