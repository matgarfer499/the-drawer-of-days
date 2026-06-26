import { content } from "@content";
import { useExperienceStore } from "@features/scene-engine";
import { useCallback, useEffect, useState } from "react";
import { audioEngine } from "./AudioEngine";

/**
 * Bridges the scene state machine to the AudioEngine: the open-the-box gesture
 * unlocks the context and starts the ambient loop and loads the playlist; opening
 * the box (reaching the hub) autostarts the music; the finale hands over to the
 * reserved song if one is configured. Returns the mute toggle for the
 * always-reachable control. Everything is a no-op while assets are absent.
 */
export function useAudio() {
  const audioUnlocked = useExperienceStore((state) => state.audioUnlocked);
  const status = useExperienceStore((state) => state.status);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!audioUnlocked) return;
    audioEngine.unlock();
    audioEngine.startAmbient(content.song.ambientSrc);
    audioEngine.loadPlaylist(content.playlist);
  }, [audioUnlocked]);

  // Opening the box (first hub) autostarts the playlist — still inside the gesture.
  useEffect(() => {
    if (status === "hub") audioEngine.startPlaylist();
  }, [status]);

  useEffect(() => {
    if (status === "finale") audioEngine.enterFinale(content.song.src);
  }, [status]);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, []);

  return { audioUnlocked, muted, toggleMuted };
}
