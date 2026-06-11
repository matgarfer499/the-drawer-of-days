import type { ReasonId, SpokeSceneId } from "./types";

interface SpokeConfig {
  /** Counts toward the finale gate. */
  isCore: boolean;
  /** Closing this scene lights this letter reason (the incremental letter). */
  unlocksReasonId?: ReasonId;
}

/**
 * Per-spoke configuration. Data-driven so the finale gate and the incremental
 * letter stay declarative — adding a spoke is an edit here, not in the reducer.
 */
export const SCENE_CONFIG: Record<SpokeSceneId, SpokeConfig> = {
  timeline: { isCore: true, unlocksReasonId: "timeline" },
  letter: { isCore: true },
  sky: { isCore: true, unlocksReasonId: "sky" },
  recipes: { isCore: true, unlocksReasonId: "recipes" },
};

/** Scenes that must be seen before the finale's secret compartment appears. */
export const CORE_SCENES: readonly SpokeSceneId[] = (
  Object.keys(SCENE_CONFIG) as SpokeSceneId[]
).filter((scene) => SCENE_CONFIG[scene].isCore);

/** Chronological order for the "show me everything" guided tour. */
export const TOUR_ORDER: readonly SpokeSceneId[] = ["timeline", "letter", "sky", "recipes"];
