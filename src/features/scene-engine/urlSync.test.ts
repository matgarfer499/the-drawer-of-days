import { describe, expect, it } from "vitest";
import { experienceReducer, initialExperienceState } from "./reducer";
import type { ExperienceAction, ExperienceState } from "./types";
import { sceneFromSearch, sceneSearchParam, sceneToSearch } from "./urlSync";

const apply = (state: ExperienceState, ...actions: ExperienceAction[]): ExperienceState =>
  actions.reduce(experienceReducer, state);
const open = (): ExperienceState =>
  apply(initialExperienceState, { type: "ENTER" }, { type: "OPEN_BOX" });
const atTimeline = (): ExperienceState => apply(open(), { type: "ENTER_SCENE", scene: "timeline" });
const atFinale = (): ExperienceState =>
  apply(
    open(),
    { type: "ENTER_SCENE", scene: "timeline" },
    { type: "CLOSE_SCENE" },
    { type: "ENTER_SCENE", scene: "letter" },
    { type: "CLOSE_SCENE" },
    { type: "ENTER_SCENE", scene: "sky" },
    { type: "CLOSE_SCENE" },
    { type: "ENTER_SCENE", scene: "recipes" },
    { type: "CLOSE_SCENE" },
    { type: "ENTER_FINALE" },
  );

describe("sceneSearchParam / sceneToSearch", () => {
  it("has no param at the door, sealed box or hub", () => {
    expect(sceneSearchParam(initialExperienceState)).toBeNull();
    expect(sceneToSearch(open())).toBe("");
  });

  it("reflects an open spoke", () => {
    expect(sceneToSearch(atTimeline())).toBe("?scene=timeline");
  });

  it("reflects the finale", () => {
    expect(sceneToSearch(atFinale())).toBe("?scene=finale");
  });
});

describe("sceneFromSearch", () => {
  it("parses a known URL scene", () => {
    expect(sceneFromSearch("?scene=timeline")).toBe("timeline");
    expect(sceneFromSearch("?scene=recipes")).toBe("recipes");
    expect(sceneFromSearch("?scene=finale")).toBe("finale");
  });

  it("returns null for no param, the hub, or an unknown value", () => {
    expect(sceneFromSearch("")).toBeNull();
    expect(sceneFromSearch("?scene=hub")).toBeNull();
    expect(sceneFromSearch("?scene=does-not-exist")).toBeNull();
  });
});

describe("round-trip", () => {
  it("parses back what it serialized", () => {
    expect(sceneFromSearch(sceneToSearch(atTimeline()))).toBe("timeline");
    expect(sceneFromSearch(sceneToSearch(atFinale()))).toBe("finale");
  });
});
