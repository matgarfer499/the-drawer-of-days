import { SCENE_CONFIG } from "@features/scene-engine";
import { describe, expect, it } from "vitest";
import { content } from "./index";
import { reasons } from "./reasons";
import { contentSchema } from "./schema";

describe("content", () => {
  it("loads and validates the whole tree on import", () => {
    expect(contentSchema.safeParse(content).success).toBe(true);
  });

  it("populates every section with placeholder data", () => {
    expect(content.hubObjects.length).toBeGreaterThan(0);
    expect(content.milestones.length).toBeGreaterThan(0);
    expect(content.reasons.length).toBeGreaterThan(0);
    expect(content.sky.nodes.length).toBeGreaterThan(0);
    expect(content.finale.ascendingPhotos.length).toBeGreaterThan(0);
  });

  it("opens exactly one hub object per spoke", () => {
    const scenes = new Set(content.hubObjects.map((object) => object.scene));
    expect(scenes).toEqual(new Set(["timeline", "letter", "sky"]));
  });

  it("keeps the finale promise blank on purpose", () => {
    expect(content.finale.promise.pendingDate).toBe("");
  });

  it("wires the incremental letter to the engine: each scene that unlocks a reason has one", () => {
    for (const [scene, config] of Object.entries(SCENE_CONFIG)) {
      if (!config.unlocksReasonId) continue;
      const reason = reasons.find((r) => r.id === config.unlocksReasonId);
      expect(reason).toBeDefined();
      expect(reason?.unlockedBy).toBe(scene);
    }
  });
});
