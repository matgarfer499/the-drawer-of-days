import { afterEach, describe, expect, it, vi } from "vitest";
import { vibrate } from "./haptics";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("vibrate", () => {
  it("buzzes through navigator.vibrate when the device supports it", () => {
    const spy = vi.fn(() => true);
    vi.stubGlobal("navigator", { vibrate: spy });
    vibrate(12);
    expect(spy).toHaveBeenCalledWith(12);
  });

  it("does nothing (and never throws) when vibration is unsupported", () => {
    vi.stubGlobal("navigator", {});
    expect(() => vibrate(12)).not.toThrow();
  });

  it("swallows a throwing vibrate (some browsers reject outside a gesture)", () => {
    vi.stubGlobal("navigator", {
      vibrate: () => {
        throw new Error("not allowed");
      },
    });
    expect(() => vibrate([10, 20, 10])).not.toThrow();
  });
});
