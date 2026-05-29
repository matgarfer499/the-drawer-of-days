import { SCENE_CONFIG } from "@features/scene-engine";
import { describe, expect, it } from "vitest";
import { spokeSceneIdSchema } from "./schema";

describe("content scene ids stay in sync with the engine", () => {
  it("the spoke enum matches scene-engine's SpokeSceneId set", () => {
    expect(new Set(spokeSceneIdSchema.options)).toEqual(new Set(Object.keys(SCENE_CONFIG)));
  });
});
