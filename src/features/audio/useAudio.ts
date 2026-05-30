import { content } from "@content";
import { useExperienceStore } from "@features/scene-engine";
import { useCallback, useEffect, useState } from "react";
import { audioEngine } from "./AudioEngine";

/**
 * Bridges the scene state machine to the AudioEngine: the open-the-box gesture
 * unlocks the context and starts the ambient loop; the finale hands over to the
 * song. Returns the mute toggle for the always-reachable control. Everything is a
 * no-op while the audio files are still placeholders.
 */
export function useAudio() {
  const audioUnlocked = useExperienceStore((state) => state.audioUnlocked);
  const status = useExperienceStore((state) => state.status);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!audioUnlocked) return;
    audioEngine.unlock();
    audioEngine.startAmbient(content.song.ambientSrc);
  }, [audioUnlocked]);

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
