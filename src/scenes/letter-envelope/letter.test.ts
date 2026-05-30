import type { Reason } from "@content";
import { describe, expect, it } from "vitest";
import { composeLetter } from "./letter";

const reason = (id: string, order: number, unlockedBy?: "timeline" | "sky"): Reason => ({
  id,
  order,
  text: `Reason ${id}`,
  ...(unlockedBy ? { unlockedBy } : {}),
});

// a(1), timeline(2, locked by timeline), b(3), sky(4, locked by sky), c(5)
const REASONS: Reason[] = [
  reason("a", 1),
  reason("timeline", 2, "timeline"),
  reason("b", 3),
  reason("sky", 4, "sky"),
  reason("c", 5),
];

describe("composeLetter", () => {
  it("keeps locked reasons pending and the rest in the envelope before any pull", () => {
    const view = composeLetter(REASONS, new Set(), 0);
    expect(view.slots.map((s) => s.status)).toEqual([
      "in-envelope",
      "pending",
      "in-envelope",
      "pending",
      "in-envelope",
    ]);
    expect(view.availableCount).toBe(3);
    expect(view.pendingCount).toBe(2);
    expect(view.revealedCount).toBe(0);
    expect(view.remaining).toBe(3);
  });

  it("pulls available reasons in order, skipping the ones still locked", () => {
    const view = composeLetter(REASONS, new Set(), 2);
    // available in order: a, b, c; pulling 2 reveals a & b; timeline/sky stay pending
    expect(view.slots.map((s) => `${s.reason.id}:${s.status}`)).toEqual([
      "a:revealed",
      "timeline:pending",
      "b:revealed",
      "sky:pending",
      "c:in-envelope",
    ]);
    expect(view.revealedCount).toBe(2);
    expect(view.remaining).toBe(1);
  });

  it("lights a previously-locked reason once its scene is unlocked", () => {
    const view = composeLetter(REASONS, new Set(["timeline"]), 9);
    expect(view.availableCount).toBe(4);
    expect(view.pendingCount).toBe(1);
    expect(view.slots.find((s) => s.reason.id === "timeline")?.status).toBe("revealed");
    expect(view.slots.find((s) => s.reason.id === "sky")?.status).toBe("pending");
  });

  it("clamps an over-pull to the number actually available", () => {
    const view = composeLetter(REASONS, new Set(), 99);
    expect(view.revealedCount).toBe(3);
    expect(view.remaining).toBe(0);
  });

  it("orders slots by `order` regardless of input order", () => {
    const shuffled = [reason("c", 5), reason("a", 1), reason("b", 3)];
    const view = composeLetter(shuffled, new Set(), 0);
    expect(view.slots.map((s) => s.reason.order)).toEqual([1, 3, 5]);
  });
});
