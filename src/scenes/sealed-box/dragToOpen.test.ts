import { describe, expect, it } from "vitest";
import { LIFT_THRESHOLD, nextPhase, shouldOpenFromDrag, UNTIE_THRESHOLD } from "./dragToOpen";

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

describe("nextPhase", () => {
  it("advances tied → untying when the sideways pull is enough", () => {
    expect(nextPhase("tied", { offset: UNTIE_THRESHOLD.distance ?? 0, velocity: 0 })).toBe(
      "untying",
    );
    expect(nextPhase("tied", { offset: 0, velocity: UNTIE_THRESHOLD.velocity ?? 0 })).toBe(
      "untying",
    );
  });

  it("stays tied on a small, slow tug of the knot", () => {
    expect(nextPhase("tied", { offset: 10, velocity: 50 })).toBe("tied");
  });

  it("untie is direction-agnostic — you can pull the knot either way", () => {
    expect(nextPhase("tied", { offset: -(UNTIE_THRESHOLD.distance ?? 0), velocity: 0 })).toBe(
      "untying",
    );
  });

  it("advances untied → lifting when the lid is pulled up far/fast enough", () => {
    expect(nextPhase("untied", { offset: LIFT_THRESHOLD.distance ?? 0, velocity: 0 })).toBe(
      "lifting",
    );
    expect(nextPhase("untied", { offset: 0, velocity: LIFT_THRESHOLD.velocity ?? 0 })).toBe(
      "lifting",
    );
  });

  it("stays untied on a small, slow lift of the lid", () => {
    expect(nextPhase("untied", { offset: 12, velocity: 80 })).toBe("untied");
  });

  it("ignores gestures during the transient untying/lifting phases", () => {
    expect(nextPhase("untying", { offset: 999, velocity: 999 })).toBe("untying");
    expect(nextPhase("lifting", { offset: 999, velocity: 999 })).toBe("lifting");
  });
});
