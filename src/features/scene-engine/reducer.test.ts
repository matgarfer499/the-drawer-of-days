import { experienceReducer, initialExperienceState } from "@features/scene-engine/reducer";
import type { ExperienceAction, ExperienceState } from "@features/scene-engine/types";
import { describe, expect, it } from "vitest";

/** Drive a sequence of actions through the reducer. */
function apply(state: ExperienceState, ...actions: ExperienceAction[]): ExperienceState {
  return actions.reduce(experienceReducer, state);
}

const open = (): ExperienceState =>
  apply(initialExperienceState, { type: "ENTER" }, { type: "OPEN_BOX" });

describe("initialExperienceState", () => {
  it("starts at the door with nothing unlocked", () => {
    expect(initialExperienceState.status).toBe("door");
    expect(initialExperienceState.activeScene).toBe("door");
    expect(initialExperienceState.audioUnlocked).toBe(false);
    expect(initialExperienceState.finaleUnlocked).toBe(false);
    expect(initialExperienceState.visitedScenes.size).toBe(0);
  });
});

describe("entering and opening the box", () => {
  it("ENTER goes to the sealed box and unlocks the audio context (user gesture)", () => {
    const s = experienceReducer(initialExperienceState, { type: "ENTER" });
    expect(s.status).toBe("sealed");
    expect(s.activeScene).toBe("seal");
    expect(s.audioUnlocked).toBe(true);
  });

  it("OPEN_BOX moves from the sealed box to the hub", () => {
    const s = open();
    expect(s.status).toBe("hub");
    expect(s.activeScene).toBe("hub");
  });

  it("ignores OPEN_BOX unless the box is sealed (guarded)", () => {
    expect(experienceReducer(initialExperienceState, { type: "OPEN_BOX" })).toBe(
      initialExperienceState,
    );
  });
});

describe("entering and closing a scene", () => {
  it("ENTER_SCENE from the hub opens that scene full-screen", () => {
    const s = experienceReducer(open(), { type: "ENTER_SCENE", scene: "timeline" });
    expect(s.status).toBe("inScene");
    expect(s.activeScene).toBe("timeline");
    expect(s.previousScene).toBe("hub");
  });

  it("ignores ENTER_SCENE unless we are at the hub", () => {
    const hub = open();
    const inScene = experienceReducer(hub, { type: "ENTER_SCENE", scene: "timeline" });
    expect(experienceReducer(inScene, { type: "ENTER_SCENE", scene: "sky" })).toBe(inScene);
  });

  it("CLOSE_SCENE returns to the hub, marks the scene seen, and lights its reason", () => {
    const s = apply(open(), { type: "ENTER_SCENE", scene: "timeline" }, { type: "CLOSE_SCENE" });
    expect(s.status).toBe("hub");
    expect(s.activeScene).toBe("hub");
    expect(s.visitedScenes.has("timeline")).toBe(true);
    expect(s.unlockedReasons.has("timeline")).toBe(true);
  });

  it("ignores CLOSE_SCENE unless a scene is open", () => {
    const hub = open();
    expect(experienceReducer(hub, { type: "CLOSE_SCENE" })).toBe(hub);
  });
});

describe("the finale gate", () => {
  const seeAllCore = (): ExperienceState =>
    apply(
      open(),
      { type: "ENTER_SCENE", scene: "timeline" },
      { type: "CLOSE_SCENE" },
      { type: "ENTER_SCENE", scene: "letter" },
      { type: "CLOSE_SCENE" },
      { type: "ENTER_SCENE", scene: "sky" },
      { type: "CLOSE_SCENE" },
    );

  it("stays locked until every core scene has been seen", () => {
    const partial = apply(
      open(),
      { type: "ENTER_SCENE", scene: "timeline" },
      { type: "CLOSE_SCENE" },
    );
    expect(partial.finaleUnlocked).toBe(false);
  });

  it("unlocks once all core scenes are seen", () => {
    expect(seeAllCore().finaleUnlocked).toBe(true);
  });

  it("ignores ENTER_FINALE while locked", () => {
    const hub = open();
    expect(experienceReducer(hub, { type: "ENTER_FINALE" })).toBe(hub);
  });

  it("enters the finale once unlocked and records it as reached", () => {
    const s = experienceReducer(seeAllCore(), { type: "ENTER_FINALE" });
    expect(s.status).toBe("finale");
    expect(s.activeScene).toBe("finale");
    expect(s.finaleReached).toBe(true);
  });
});

describe("purity", () => {
  it("never mutates the previous state", () => {
    const before = open();
    const visitedBefore = before.visitedScenes;
    experienceReducer(before, { type: "ENTER_SCENE", scene: "timeline" });
    expect(before.visitedScenes).toBe(visitedBefore);
    expect(before.status).toBe("hub");
  });
});

describe("the guided tour", () => {
  it("START_TOUR enters the first scene in chronological order", () => {
    const s = experienceReducer(open(), { type: "START_TOUR" });
    expect(s.tour.active).toBe(true);
    expect(s.status).toBe("inScene");
    expect(s.activeScene).toBe("timeline");
  });

  it("TOUR_NEXT marks the current scene seen and advances", () => {
    const s = apply(open(), { type: "START_TOUR" }, { type: "TOUR_NEXT" });
    expect(s.visitedScenes.has("timeline")).toBe(true);
    expect(s.activeScene).toBe("letter");
  });

  it("STOP_TOUR ends the tour and returns to the hub", () => {
    const s = apply(open(), { type: "START_TOUR" }, { type: "STOP_TOUR" });
    expect(s.tour.active).toBe(false);
    expect(s.status).toBe("hub");
  });
});
