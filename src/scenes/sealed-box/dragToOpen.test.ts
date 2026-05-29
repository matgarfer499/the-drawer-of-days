import { describe, expect, it } from "vitest";
import { shouldOpenFromDrag } from "./dragToOpen";

describe("shouldOpenFromDrag", () => {
  it("does not open on a small, slow tug", () => {
    expect(shouldOpenFromDrag({ offset: 20, velocity: 100 })).toBe(false);
  });

  it("opens when pulled past the distance threshold", () => {
    expect(shouldOpenFromDrag({ offset: 90, velocity: 0 })).toBe(true);
  });

  it("opens on a quick flick even if short", () => {
    expect(shouldOpenFromDrag({ offset: 20, velocity: 600 })).toBe(true);
  });

  it("is direction-agnostic — you can tug the bow either way", () => {
    expect(shouldOpenFromDrag({ offset: -90, velocity: 0 })).toBe(true);
    expect(shouldOpenFromDrag({ offset: 0, velocity: -600 })).toBe(true);
  });

  it("respects custom thresholds", () => {
    expect(shouldOpenFromDrag({ offset: 30, velocity: 0 }, { distance: 25 })).toBe(true);
  });
});
