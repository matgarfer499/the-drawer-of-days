import { describe, expect, it } from "vitest";
import { hubLayout, hubPositionVars } from "./hubLayout";

interface P {
  x: number;
  y: number;
}

const minPairwise = (pts: P[]): number => {
  let m = Number.POSITIVE_INFINITY;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i];
      const b = pts[j];
      if (!a || !b) continue;
      m = Math.min(m, Math.hypot(a.x - b.x, a.y - b.y));
    }
  }
  return m;
};

describe("hubLayout", () => {
  it("returns no points for an empty hub", () => {
    expect(hubLayout(0)).toEqual([]);
  });

  it("places every object inside the safe band", () => {
    for (let n = 3; n <= 7; n++) {
      const pts = hubLayout(n, 1);
      expect(pts).toHaveLength(n);
      for (const p of pts) {
        expect(p.x).toBeGreaterThanOrEqual(10);
        expect(p.x).toBeLessThanOrEqual(90);
        expect(p.y).toBeGreaterThanOrEqual(10);
        expect(p.y).toBeLessThanOrEqual(90);
      }
    }
  });

  it("keeps objects from overlapping (≥16% apart)", () => {
    for (let n = 3; n <= 7; n++) {
      expect(minPairwise(hubLayout(n, 3))).toBeGreaterThanOrEqual(16);
    }
  });

  it("is deterministic for the same seed", () => {
    expect(hubLayout(5, 42)).toEqual(hubLayout(5, 42));
  });

  it("reshuffles with a different seed", () => {
    expect(hubLayout(5, 1)).not.toEqual(hubLayout(5, 2));
  });
});

describe("hubPositionVars", () => {
  it("exposes the centre as percentage CSS variables", () => {
    expect(hubPositionVars({ x: 30, y: 70 })).toEqual({ "--hub-x": "30.00%", "--hub-y": "70.00%" });
  });
});
