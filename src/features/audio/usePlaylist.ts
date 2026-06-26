import { useSyncExternalStore } from "react";
import { audioEngine, type PlaylistSnapshot } from "./AudioEngine";

/**
 * Subscribe the dynamic island to the engine's playlist state. The engine stays
 * the sole owner of Howler; components read this snapshot and call the engine's
 * play/pause/next/prev — they never poke Howler directly.
 */
export function usePlaylist(): PlaylistSnapshot {
  return useSyncExternalStore(
    audioEngine.subscribe,
    audioEngine.getSnapshot,
    audioEngine.getSnapshot,
  );
}
