import type { ExperienceState, SceneId } from "./types";

const SCENE_PARAM = "scene";

/** Scenes that appear in the URL, so the visitor can resume / the back button works. */
const URL_SCENES: ReadonlySet<SceneId> = new Set<SceneId>([
  "timeline",
  "letter",
  "sky",
  "recipes",
  "finale",
]);

/** The `?scene=` value for a state, or null when the active node is the door/box/hub. */
export function sceneSearchParam(state: ExperienceState): SceneId | null {
  return URL_SCENES.has(state.activeScene) ? state.activeScene : null;
}

/** The search string for a single scene id — "" when it isn't a URL scene. */
export function searchForScene(scene: SceneId): string {
  return URL_SCENES.has(scene) ? `?${SCENE_PARAM}=${scene}` : "";
}

/** The search string for a state — "" at the hub, "?scene=timeline" in a scene. */
export function sceneToSearch(state: ExperienceState): string {
  return searchForScene(state.activeScene);
}

/** Parse a search string into a known URL scene, or null if absent/unknown. */
export function sceneFromSearch(search: string): SceneId | null {
  const value = new URLSearchParams(search).get(SCENE_PARAM);
  return value && URL_SCENES.has(value as SceneId) ? (value as SceneId) : null;
}
