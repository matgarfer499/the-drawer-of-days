import { CORE_SCENES, SCENE_CONFIG, TOUR_ORDER } from "./config";
import type { ExperienceAction, ExperienceState, ReasonId, SpokeSceneId } from "./types";

export const initialExperienceState: ExperienceState = {
  status: "door",
  activeScene: "door",
  previousScene: null,
  visitedScenes: new Set(),
  unlockedReasons: new Set(),
  finaleUnlocked: false,
  finaleReached: false,
  audioUnlocked: false,
  tour: { active: false, index: 0 },
};

interface VisitResult {
  visitedScenes: ReadonlySet<SpokeSceneId>;
  unlockedReasons: ReadonlySet<ReasonId>;
  finaleUnlocked: boolean;
}

/** Mark a spoke seen, light its reason, and recompute the finale gate. Pure. */
function recordVisit(state: ExperienceState, scene: SpokeSceneId): VisitResult {
  const visitedScenes = new Set(state.visitedScenes).add(scene);
  const unlockedReasons = new Set(state.unlockedReasons);
  const reason = SCENE_CONFIG[scene].unlocksReasonId;
  if (reason) unlockedReasons.add(reason);
  return {
    visitedScenes,
    unlockedReasons,
    finaleUnlocked: CORE_SCENES.every((core) => visitedScenes.has(core)),
  };
}

/**
 * The experience state machine. A pure, guarded reducer: actions that don't apply
 * to the current status are no-ops (they return the same state reference), so the
 * machine stays consistent even when driven by the URL or the browser's back button.
 */
export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "ENTER":
      if (state.status !== "door") return state;
      return {
        ...state,
        status: "sealed",
        previousScene: "door",
        activeScene: "seal",
        audioUnlocked: true,
      };

    case "OPEN_BOX":
      if (state.status !== "sealed") return state;
      return { ...state, status: "hub", previousScene: "seal", activeScene: "hub" };

    case "ENTER_SCENE":
      if (state.status !== "hub") return state;
      return { ...state, status: "inScene", previousScene: "hub", activeScene: action.scene };

    case "CLOSE_SCENE": {
      if (state.status !== "inScene") return state;
      // While inScene the active node is always a spoke (only ENTER_SCENE/tour set it).
      const scene = state.activeScene as SpokeSceneId;
      return {
        ...state,
        status: "hub",
        previousScene: scene,
        activeScene: "hub",
        ...recordVisit(state, scene),
      };
    }

    case "ENTER_FINALE":
      if (state.status !== "hub" || !state.finaleUnlocked) return state;
      return {
        ...state,
        status: "finale",
        previousScene: "hub",
        activeScene: "finale",
        finaleReached: true,
      };

    case "CLOSE_FINALE":
      if (state.status !== "finale") return state;
      return { ...state, status: "hub", previousScene: "finale", activeScene: "hub" };

    case "START_TOUR": {
      if (state.status !== "hub") return state;
      const first = TOUR_ORDER[0];
      if (!first) return state;
      return {
        ...state,
        status: "inScene",
        previousScene: "hub",
        activeScene: first,
        tour: { active: true, index: 0 },
      };
    }

    case "TOUR_NEXT": {
      if (!state.tour.active || state.status !== "inScene") return state;
      const current = state.activeScene as SpokeSceneId;
      const visit = recordVisit(state, current);
      const nextIndex = state.tour.index + 1;
      const next = TOUR_ORDER[nextIndex];
      if (!next) {
        return {
          ...state,
          status: "hub",
          previousScene: current,
          activeScene: "hub",
          ...visit,
          tour: { active: false, index: 0 },
        };
      }
      return {
        ...state,
        status: "inScene",
        previousScene: current,
        activeScene: next,
        ...visit,
        tour: { active: true, index: nextIndex },
      };
    }

    case "STOP_TOUR":
      if (!state.tour.active) return state;
      return {
        ...state,
        status: "hub",
        previousScene: state.activeScene,
        activeScene: "hub",
        tour: { active: false, index: 0 },
      };

    default:
      return state;
  }
}
