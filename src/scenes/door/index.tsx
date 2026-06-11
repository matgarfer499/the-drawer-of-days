import { content } from "@content";
import { audioEngine } from "@features/audio";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { vibrate } from "@shared/lib/haptics";
import { seededTransformVars } from "@shared/lib/seededRotation";
import { Doodle } from "@shared/ui/Doodle";
import { GrainOverlay } from "@shared/ui/GrainOverlay";
import { PhotoCorner } from "@shared/ui/PhotoCorner";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { WashiTape } from "@shared/ui/WashiTape";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";

const door = tv({
  slots: {
    // late-afternoon light falling on the page where the card waits — it breathes
    backdrop:
      "pointer-events-none absolute inset-0 bg-radial-[at_50%_30%] from-golden-hour/15 to-transparent motion-safe:animate-light-breathe",
    pageTape: "absolute top-[14%] left-[7%] rotate-12",
    pageDoodle: "absolute right-[8%] bottom-[10%]",
    pageSpiral: "absolute top-[10%] right-[12%]",
    button:
      "relative flex flex-col items-center gap-4 rounded-sm bg-paper-cream px-8 py-10 shadow-paper-lifted rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-deep",
    tape: "-top-3 absolute left-1/2 -translate-x-1/2",
    greeting:
      "max-w-xs text-balance font-display type-poster text-4xl font-medium leading-tight text-ink-sepia",
    hint: "mt-2 text-xs uppercase tracking-[0.25em] text-faded-ink",
  },
});

/**
 * The soft door — "this is for you": a paper cover card taped to the page,
 * waiting in a pool of golden-hour light. A single tap enters and resumes the
 * audio context *synchronously inside the gesture* (autoplay-policy safe); the
 * reducer also flips audioUnlocked, which starts the ambient loop. Greeting
 * comes from @content; no page chrome.
 */
export function Door() {
  const enter = useExperienceStore((state) => state.enter);
  const reduced = useReducedMotion();
  const { backdrop, button, tape, greeting, hint, pageTape, pageDoodle, pageSpiral } = door();
  const handleEnter = () => {
    vibrate(10);
    audioEngine.unlock();
    enter();
  };
  return (
    <SceneFrame>
      <div className={backdrop()} aria-hidden="true" />
      {/* the page around the card has been lived on: a stray tape, pencil marks */}
      <span aria-hidden="true" className={pageTape()}>
        <WashiTape id="door-washi-2" tone="kraft" length="sm" />
      </span>
      <Doodle id="door-doodle" kind="asterisk" tone="ink" size="lg" className={pageDoodle()} />
      <Doodle id="door-spiral" kind="spiral" tone="ink" size="md" className={pageSpiral()} />
      {/* h1 wraps the button (button is phrasing content) so the entry screen has
          a heading without shrinking the full-screen tap target */}
      <h1 className="contents">
        <motion.button
          type="button"
          className={button()}
          style={seededTransformVars("door-card", {
            maxRotation: 2.5,
            maxOffset: 3,
            seed: content.seed,
          })}
          onClick={handleEnter}
          whileHover={reduced ? {} : { scale: 1.02 }}
          whileTap={reduced ? {} : { scale: 0.98 }}
        >
          <GrainOverlay />
          <WashiTape id="door-tape" tone="golden" className={tape()} />
          <PhotoCorner corner="tl" tone="kraft" />
          <PhotoCorner corner="br" tone="kraft" />
          <motion.span
            className={greeting()}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.opening.greetingLine}
          </motion.span>
          <motion.span
            className={hint()}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            toca para entrar
          </motion.span>
        </motion.button>
      </h1>
    </SceneFrame>
  );
}
