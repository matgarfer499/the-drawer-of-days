import { describe, expect, it } from "vitest";
import { cassetteRate, formatPostmark, nearestTrack } from "./cassette";

describe("formatPostmark", () => {
  it("renders an ISO date as an inked Spanish postmark", () => {
    expect(formatPostmark("2021-09-14")).toBe("14 SEP 2021");
    expect(formatPostmark("2023-03-21")).toBe("21 MAR 2023");
    expect(formatPostmark("2024-09-14")).toBe("14 SEP 2024");
  });

  it("drops the leading zero on the day", () => {
    expect(formatPostmark("2022-06-02")).toBe("2 JUN 2022");
  });

  it("does not drift across timezones (no Date parsing)", () => {
    // a naive `new Date("2021-01-01")` is UTC midnight and can fall on Dec 31
    // in negative offsets — the postmark must read the digits literally.
    expect(formatPostmark("2021-01-01")).toBe("1 ENE 2021");
    expect(formatPostmark("2021-12-31")).toBe("31 DIC 2021");
  });
});

describe("nearestTrack", () => {
  it("snaps whole-track progress to the closest milestone index", () => {
    expect(nearestTrack(0, 4)).toBe(0);
    expect(nearestTrack(1, 4)).toBe(3);
    expect(nearestTrack(0.5, 4)).toBe(2); // 0.5 * 3 = 1.5 → rounds up
  });

  it("clamps progress that overshoots either end", () => {
    expect(nearestTrack(-0.2, 4)).toBe(0);
    expect(nearestTrack(1.4, 4)).toBe(3);
  });

  it("stays on the only track when there is a single milestone", () => {
    expect(nearestTrack(0.7, 1)).toBe(0);
  });
});

describe("cassetteRate", () => {
  it("rests at normal speed when the tape is still", () => {
    expect(cassetteRate(0)).toBe(1);
  });

  it("speeds up with how fast you scrub, regardless of direction", () => {
    expect(cassetteRate(0.8)).toBeCloseTo(1.8);
    expect(cassetteRate(-0.8)).toBeCloseTo(1.8);
  });

  it("clamps to a sane maximum so a flick never shrieks", () => {
    expect(cassetteRate(5)).toBe(2.5);
  });
});
