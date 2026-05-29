import { CORE_SCENES } from "./config";
import type { ExperienceState, SpokeSceneId } from "./types";

/** A spoke not yet opened is shown veiled (faded) in the hub. */
export function isVeiled(state: ExperienceState, scene: SpokeSceneId): boolean {
  return !state.visitedScenes.has(scene);
}

/** Opened spokes in the order they were seen — drives the red thread across the hub. */
export function threadPath(state: ExperienceState): SpokeSceneId[] {
  return [...state.visitedScenes];
}

/** How many letter reasons have been lit so far (the incremental letter). */
export function reasonsLit(state: ExperienceState): number {
  return state.unlockedReasons.size;
}

/** The secret compartment is reachable: at the hub with the gate open. */
export function canEnterFinale(state: ExperienceState): boolean {
  return state.status === "hub" && state.finaleUnlocked;
}

/** Fraction of core scenes seen (0..1) — for diegetic, non-bar progress cues. */
export function coreProgress(state: ExperienceState): number {
  if (CORE_SCENES.length === 0) return 0;
  const seen = CORE_SCENES.filter((scene) => state.visitedScenes.has(scene)).length;
  return seen / CORE_SCENES.length;
}
