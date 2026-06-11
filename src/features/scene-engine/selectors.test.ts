import { describe, expect, it } from "vitest";
import { experienceReducer, initialExperienceState } from "./reducer";
import { canEnterFinale, coreProgress, isVeiled, reasonsLit, threadPath } from "./selectors";
import type { ExperienceAction, ExperienceState } from "./types";

const apply = (state: ExperienceState, ...actions: ExperienceAction[]): ExperienceState =>
  actions.reduce(experienceReducer, state);

const open = (): ExperienceState =>
  apply(initialExperienceState, { type: "ENTER" }, { type: "OPEN_BOX" });

const visit = (
  state: ExperienceState,
  scene: "timeline" | "letter" | "sky" | "recipes",
): ExperienceState => apply(state, { type: "ENTER_SCENE", scene }, { type: "CLOSE_SCENE" });

/** Visit every core scene in order — the finale gate's precondition. */
const visitAllCore = (): ExperienceState =>
  visit(visit(visit(visit(open(), "timeline"), "letter"), "sky"), "recipes");

describe("isVeiled", () => {
  it("veils a spoke until it has been opened", () => {
    const hub = open();
    expect(isVeiled(hub, "timeline")).toBe(true);
    expect(isVeiled(visit(hub, "timeline"), "timeline")).toBe(false);
  });
});

describe("threadPath", () => {
  it("lists opened spokes in the order they were seen (the red thread)", () => {
    const path = threadPath(visit(visit(open(), "timeline"), "sky"));
    expect(path).toEqual(["timeline", "sky"]);
  });
});

describe("reasonsLit", () => {
  it("counts the letter reasons unlocked so far", () => {
    expect(reasonsLit(open())).toBe(0);
    expect(reasonsLit(visit(open(), "timeline"))).toBe(1);
  });
});

describe("canEnterFinale", () => {
  it("is false at the hub while the gate is locked", () => {
    expect(canEnterFinale(open())).toBe(false);
  });

  it("is true at the hub once every core scene has been seen", () => {
    expect(canEnterFinale(visitAllCore())).toBe(true);
  });
});

describe("coreProgress", () => {
  it("reports fractional progress through the core scenes", () => {
    expect(coreProgress(open())).toBe(0);
    expect(coreProgress(visit(open(), "timeline"))).toBeCloseTo(1 / 4);
    expect(coreProgress(visitAllCore())).toBe(1);
  });
});
