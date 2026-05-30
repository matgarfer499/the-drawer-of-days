import { content } from "@content";
import { audioEngine } from "@features/audio";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";

const door = tv({
  slots: {
    button:
      "flex flex-col items-center gap-4 rounded-3xl px-8 py-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-deep",
    greeting:
      "max-w-xs text-balance font-display text-4xl font-semibold leading-tight text-ink-sepia",
    hint: "mt-2 text-xs uppercase tracking-[0.25em] text-faded-ink",
  },
});

/**
 * The soft door — "this is for you". A single tap enters and resumes the audio
 * context *synchronously inside the gesture* (autoplay-policy safe); the reducer
 * also flips audioUnlocked, which starts the ambient loop. Greeting comes from
 * @content; no page chrome.
 */
export function Door() {
  const enter = useExperienceStore((state) => state.enter);
  const reduced = useReducedMotion();
  const { button, greeting, hint } = door();
  const handleEnter = () => {
    audioEngine.unlock();
    enter();
  };
  return (
    <SceneFrame>
      <motion.button
        type="button"
        className={button()}
        onClick={handleEnter}
        whileTap={reduced ? {} : { scale: 0.98 }}
      >
        <span className={greeting()}>{content.opening.greetingLine}</span>
        <span className={hint()}>toca para entrar</span>
      </motion.button>
    </SceneFrame>
  );
}
