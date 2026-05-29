import {
  hashId,
  mulberry32,
  seededTransform,
  seededTransformVars,
} from "@shared/lib/seededRotation";
import { describe, expect, it } from "vitest";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("yields values within [0, 1)", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("hashId", () => {
  it("is stable and stays within 32 bits", () => {
    expect(hashId("hello")).toBe(hashId("hello"));
    expect(hashId("hello")).toBeGreaterThanOrEqual(0);
    expect(hashId("hello")).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("seededTransform", () => {
  it("is stable across calls for the same id", () => {
    expect(seededTransform("polaroid-1")).toEqual(seededTransform("polaroid-1"));
  });

  it("differs for different ids", () => {
    expect(seededTransform("a")).not.toEqual(seededTransform("b"));
  });

  it("respects the rotation and offset bounds", () => {
    for (const id of ["x", "milestone-01", "star-7", "envelope", "cassette"]) {
      const t = seededTransform(id, { maxRotation: 4, maxOffset: 3 });
      expect(Math.abs(t.rotation)).toBeLessThanOrEqual(4);
      expect(Math.abs(t.offsetX)).toBeLessThanOrEqual(3);
      expect(Math.abs(t.offsetY)).toBeLessThanOrEqual(3);
    }
  });

  it("reshuffles when the global seed changes", () => {
    expect(seededTransform("a", { seed: 1 })).not.toEqual(seededTransform("a", { seed: 2 }));
  });
});

describe("seededTransformVars", () => {
  it("exposes deg/px CSS custom properties", () => {
    const vars = seededTransformVars("polaroid-1");
    expect(vars["--seed-rot"]).toMatch(/deg$/);
    expect(vars["--seed-x"]).toMatch(/px$/);
    expect(vars["--seed-y"]).toMatch(/px$/);
  });
});
