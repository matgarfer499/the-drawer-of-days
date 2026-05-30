import { describe, expect, it } from "vitest";
import { ascendingLayout } from "./ascending";

describe("ascendingLayout", () => {
  it("places one item per photo", () => {
    expect(ascendingLayout(5, 7)).toHaveLength(5);
    expect(ascendingLayout(0, 7)).toEqual([]);
  });

  it("is deterministic for the same seed", () => {
    expect(ascendingLayout(6, 42)).toEqual(ascendingLayout(6, 42));
  });

  it("reshuffles with a different seed", () => {
    const a = ascendingLayout(6, 1);
    const b = ascendingLayout(6, 2);
    expect(a).not.toEqual(b);
  });

  it("keeps every item within the safe margins and tilt", () => {
    for (const item of ascendingLayout(9, 99)) {
      expect(item.x).toBeGreaterThanOrEqual(15);
      expect(item.x).toBeLessThanOrEqual(85);
      expect(Math.abs(item.rotate)).toBeLessThanOrEqual(8);
      expect(item.delay).toBeGreaterThanOrEqual(0);
    }
  });

  it("rises in sequence — each photo starts after the previous", () => {
    const items = ascendingLayout(8, 3);
    for (let i = 1; i < items.length; i += 1) {
      const prev = items[i - 1];
      const curr = items[i];
      if (prev && curr) expect(curr.delay).toBeGreaterThan(prev.delay);
    }
  });
});
