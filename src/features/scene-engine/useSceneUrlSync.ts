import { useEffect } from "react";
import { useExperienceStore } from "./store";
import type { SpokeSceneId } from "./types";
import { sceneFromSearch, searchForScene } from "./urlSync";

/**
 * Two-way bind the active scene with the URL: the store writes `?scene=` (so a
 * reload or a shared link resumes where she left off), and the browser's
 * back/forward buttons drive the store — back from a scene closes it, exactly
 * like the invariable close gesture.
 */
export function useSceneUrlSync(): void {
  const activeScene = useExperienceStore((state) => state.activeScene);

  // store → URL (the param depends only on which scene is active)
  useEffect(() => {
    const next = `${window.location.pathname}${searchForScene(activeScene)}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (next !== current) window.history.pushState(null, "", next);
  }, [activeScene]);

  // URL (back/forward) → store
  useEffect(() => {
    const onPopState = () => {
      const target = sceneFromSearch(window.location.search);
      const store = useExperienceStore.getState();
      if (!target) {
        if (store.status === "inScene") store.closeScene();
        else if (store.status === "finale") store.closeFinale();
        return;
      }
      if (target === "finale") {
        if (store.status === "hub") store.enterFinale();
        return;
      }
      if (store.status === "hub") store.enterScene(target as SpokeSceneId);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
}
