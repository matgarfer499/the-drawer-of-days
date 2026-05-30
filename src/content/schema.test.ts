import { describe, expect, it } from "vitest";
import { assetRefSchema, contentSchema, milestoneSchema, reasonSchema } from "./schema";

const validAsset = { src: "/p.svg", alt: "una foto nuestra", width: 1200, height: 1500 };

describe("assetRefSchema", () => {
  it("accepts a complete asset reference", () => {
    expect(assetRefSchema.safeParse(validAsset).success).toBe(true);
  });

  it("requires alt text (a11y — every image is described)", () => {
    expect(assetRefSchema.safeParse({ ...validAsset, alt: "" }).success).toBe(false);
  });

  it("requires positive integer dimensions (so layout never shifts, CLS=0)", () => {
    expect(assetRefSchema.safeParse({ ...validAsset, width: 0 }).success).toBe(false);
    expect(assetRefSchema.safeParse({ ...validAsset, height: 12.5 }).success).toBe(false);
  });
});

describe("milestoneSchema", () => {
  const milestone = { id: "m1", date: "2023-02-14", title: "t", body: "b", photos: [validAsset] };

  it("accepts a valid milestone and defaults the cassette side to A", () => {
    const result = milestoneSchema.safeParse(milestone);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.side).toBe("A");
  });

  it("rejects a non-ISO date", () => {
    expect(milestoneSchema.safeParse({ ...milestone, date: "14/02/2023" }).success).toBe(false);
  });
});

describe("reasonSchema", () => {
  it("rejects an unlockedBy that is not a real spoke scene", () => {
    const result = reasonSchema.safeParse({ id: "r1", order: 1, text: "x", unlockedBy: "door" });
    expect(result.success).toBe(false);
  });
});

const node = (id: string) => ({ id, label: id, position: { x: 10, y: 20 } });
const baseContent = {
  herName: "X",
  anniversaryDate: "2024-02-14",
  relationshipStartDate: "2021-02-14",
  seed: 1,
  opening: { greetingLine: "g", subGreetingLine: "s" },
  hubObjects: [{ id: "h1", label: "l", scene: "timeline", art: validAsset, palmSize: true }],
  milestones: [{ id: "m1", date: "2023-02-14", title: "t", body: "b", photos: [validAsset] }],
  reasons: [{ id: "r1", order: 1, text: "x" }],
  sky: {
    nodes: [node("n1"), node("n2")],
    constellations: [{ id: "c1", name: "n", starIds: ["n1", "n2"] }],
    revealMessage: "r",
  },
  song: { src: "/s.mp3", title: "t", artist: "a", ambientSrc: "/a.mp3" },
  finale: {
    thesisLine: "t",
    ascendingPhotos: [validAsset],
    promise: { frameLabel: "f", pendingDate: "", pendingLabel: "p", note: "n" },
  },
};

describe("contentSchema integrity", () => {
  it("accepts a coherent content tree", () => {
    expect(contentSchema.safeParse(baseContent).success).toBe(true);
  });

  it("keeps the promise's pending date intentionally empty", () => {
    const broken = {
      ...baseContent,
      finale: {
        ...baseContent.finale,
        promise: { frameLabel: "f", pendingDate: "2099-01-01", pendingLabel: "p", note: "n" },
      },
    };
    expect(contentSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects a constellation that references a missing sky node", () => {
    const broken = {
      ...baseContent,
      sky: {
        ...baseContent.sky,
        constellations: [{ id: "c1", name: "n", starIds: ["n1", "ghost"] }],
      },
    };
    expect(contentSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects duplicate milestone ids", () => {
    const broken = {
      ...baseContent,
      milestones: [baseContent.milestones[0], { ...baseContent.milestones[0] }],
    };
    expect(contentSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects duplicate constellation ids", () => {
    const broken = {
      ...baseContent,
      sky: {
        ...baseContent.sky,
        constellations: [
          { id: "c1", name: "n", starIds: ["n1", "n2"] },
          { id: "c1", name: "m", starIds: ["n1", "n2"] },
        ],
      },
    };
    expect(contentSchema.safeParse(broken).success).toBe(false);
  });
});
