import type { Finale } from "@content";
import { Doodle } from "@shared/ui/Doodle";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { tv } from "tailwind-variants";

const ui = tv({
  slots: {
    // the discreet invitation, resting low and centred above the safe area
    cue: [
      "absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-30 -translate-x-1/2",
      "flex min-h-11 items-center gap-2 rounded-full px-5 py-2",
      "font-hand text-lg text-silver-pen/85 transition-colors hover:text-silver-pen",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-golden-hour",
    ],
    arrow: "text-silver-pen/70 motion-safe:animate-peek",
    // the curtain: a near-opaque night veil over the settled finale
    screen:
      "absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-night-paper/92 px-8 text-center",
    message:
      "max-w-md font-display type-tender text-4xl text-silver-pen leading-tight [text-shadow:0_0_24px_var(--color-golden-hour)]",
    signature: "font-hand text-xl text-silver-pen/80",
  },
});

interface ClosingProps {
  closing: Finale["closing"];
  reduced: boolean;
  /** ms to wait after the scene settles before the cue invites the tap */
  settleDelayMs: number;
}

/**
 * The closing curtain. Once the finale settles, a discreet "continuar" cue rises
 * and waits; a tap draws the curtain — a near-opaque night veil bearing the
 * farewell line and its signature — to mark the presentation's end. The close
 * control (top-left ✕ / Escape / back) still returns to the box from here.
 * Reduced motion offers the cue at once and crossfades the curtain in.
 */
export function Closing({ closing, reduced, settleDelayMs }: ClosingProps) {
  const [cued, setCued] = useState(reduced);
  const [revealed, setRevealed] = useState(false);
  const s = ui();

  useEffect(() => {
    if (cued) return;
    const id = setTimeout(() => setCued(true), settleDelayMs);
    return () => clearTimeout(id);
  }, [cued, settleDelayMs]);

  const lineProps = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <>
      <AnimatePresence>
        {cued && !revealed ? (
          <motion.button
            key="cue"
            type="button"
            className={s.cue()}
            onClick={() => setRevealed(true)}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {closing.cue}
            <span aria-hidden="true" className={s.arrow()}>
              →
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {revealed ? (
          <motion.div
            key="screen"
            className={s.screen()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.5 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span {...lineProps(0.15)}>
              <Doodle id="closing-star" kind="asterisk" tone="silver" size="md" />
            </motion.span>
            <motion.p className={s.message()} {...lineProps(0.3)}>
              {closing.message}
            </motion.p>
            <motion.p className={s.signature()} {...lineProps(0.6)}>
              {closing.signature}
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
