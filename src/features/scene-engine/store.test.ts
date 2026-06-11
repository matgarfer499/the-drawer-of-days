import { beforeEach, describe, expect, it } from "vitest";
import { useExperienceStore } from "./store";
import type { SpokeSceneId } from "./types";

const get = () => useExperienceStore.getState();

beforeEach(() => {
  get().reset();
});

describe("useExperienceStore", () => {
  it("walks door → sealed → hub through the action creators", () => {
    get().enter();
    expect(get().status).toBe("sealed");
    expect(get().audioUnlocked).toBe(true);
    get().openBox();
    expect(get().status).toBe("hub");
  });

  it("guards illegal actions — entering the finale while locked is a no-op", () => {
    get().enter();
    get().openBox();
    get().enterFinale();
    expect(get().status).toBe("hub");
  });

  it("seeing every core scene unlocks the finale and lets it be entered", () => {
    get().enter();
    get().openBox();
    for (const scene of ["timeline", "letter", "sky", "recipes"] satisfies SpokeSceneId[]) {
      get().enterScene(scene);
      get().closeScene();
    }
    expect(get().finaleUnlocked).toBe(true);
    get().enterFinale();
    expect(get().status).toBe("finale");
    expect(get().finaleReached).toBe(true);
  });

  it("reset returns to the initial door state", () => {
    get().enter();
    get().reset();
    expect(get().status).toBe("door");
    expect(get().visitedScenes.size).toBe(0);
  });
});
