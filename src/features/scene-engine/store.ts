import { create } from "zustand";
import { experienceReducer, initialExperienceState } from "./reducer";
import type { ExperienceAction, ExperienceState, SpokeSceneId } from "./types";

interface ExperienceActions {
  /** Dispatch a raw action through the guarded reducer. */
  dispatch: (action: ExperienceAction) => void;
  enter: () => void;
  openBox: () => void;
  enterScene: (scene: SpokeSceneId) => void;
  closeScene: () => void;
  enterFinale: () => void;
  closeFinale: () => void;
  startTour: () => void;
  tourNext: () => void;
  stopTour: () => void;
  /** Back to the initial door state (used by tests and "start over"). */
  reset: () => void;
}

export type ExperienceStore = ExperienceState & ExperienceActions;

/**
 * The single bridge between the scene state machine and React. State lives in the
 * pure reducer; the store just threads actions through it. Read with granular
 * selectors in components, and `useExperienceStore.getState()` inside `useFrame`.
 */
export const useExperienceStore = create<ExperienceStore>((set, get) => ({
  ...initialExperienceState,
  dispatch: (action) => set((state) => experienceReducer(state, action)),
  enter: () => get().dispatch({ type: "ENTER" }),
  openBox: () => get().dispatch({ type: "OPEN_BOX" }),
  enterScene: (scene) => get().dispatch({ type: "ENTER_SCENE", scene }),
  closeScene: () => get().dispatch({ type: "CLOSE_SCENE" }),
  enterFinale: () => get().dispatch({ type: "ENTER_FINALE" }),
  closeFinale: () => get().dispatch({ type: "CLOSE_FINALE" }),
  startTour: () => get().dispatch({ type: "START_TOUR" }),
  tourNext: () => get().dispatch({ type: "TOUR_NEXT" }),
  stopTour: () => get().dispatch({ type: "STOP_TOUR" }),
  reset: () => set({ ...initialExperienceState }),
}));
