import { describe, expect, it } from "vitest";
import { type Point, stitchPath } from "./stitchPath";

const a: Point = { x: 10, y: 20 };
const b: Point = { x: 90, y: 60 };

describe("stitchPath", () => {
  it("draws a quadratic curve from the start point to the end point", () => {
    const d = stitchPath(a, b, "thread-1");
    expect(d).toMatch(/^M [-\d.]+ [-\d.]+ Q [-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+$/);
    expect(d.startsWith("M 10.00 20.00")).toBe(true);
    expect(d.endsWith("90.00 60.00")).toBe(true);
  });

  it("is deterministic for the same id", () => {
    expect(stitchPath(a, b, "same")).toBe(stitchPath(a, b, "same"));
  });

  it("varies the seeded sag by id", () => {
    expect(stitchPath(a, b, "one")).not.toBe(stitchPath(a, b, "two"));
  });

  it("never produces NaN, even when start and end coincide", () => {
    expect(stitchPath(a, a, "degenerate")).not.toContain("NaN");
  });

  it("keeps the control point within the configured sag of the midpoint", () => {
    const maxSag = 6;
    const d = stitchPath(a, b, "bounded", { maxSag });
    const match = d.match(/Q ([-\d.]+) ([-\d.]+)/);
    expect(match).not.toBeNull();
    const cx = Number(match?.[1]);
    const cy = Number(match?.[2]);
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    expect(Math.hypot(cx - midX, cy - midY)).toBeLessThanOrEqual(maxSag + 1e-6);
  });
});
