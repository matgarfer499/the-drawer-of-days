import { GrainOverlay } from "@shared/ui/GrainOverlay";
import { motion } from "motion/react";
import { useState } from "react";
import { tv } from "tailwind-variants";

const reveal = tv({
  slots: {
    // the false bottom itself: a sheet of kraft cardboard over the compartment,
    // above the photos and heading but under the persistent close control (z-50)
    panel: "pointer-events-none absolute inset-0 z-20 overflow-hidden bg-kraft-tan",
    // the floor darkens toward the night just before it gives way
    veil: "absolute inset-0 bg-night-paper",
  },
});

interface DoubleBottomRevealProps {
  reduced: boolean;
}

/**
 * The false bottom dissolving into the sky. On mount a sheet of kraft cardboard
 * fills the compartment, darkens toward night, then fades and lifts away — the
 * floor of the box giving up the paper sky and the photos rising beneath it. It
 * self-unmounts once the dissolve completes. Reduced motion drops it entirely:
 * the finale simply opens at rest, with no floor to clear.
 */
export function DoubleBottomReveal({ reduced }: DoubleBottomRevealProps) {
  const [done, setDone] = useState(false);
  if (reduced || done) return null;
  const { panel, veil } = reveal();
  return (
    <motion.div
      aria-hidden="true"
      className={panel()}
      initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      animate={{
        opacity: [1, 1, 0],
        scale: [1, 1.02, 1.06],
        filter: ["blur(0px)", "blur(0px)", "blur(6px)"],
      }}
      transition={{ duration: 1.3, ease: [0.33, 1, 0.68, 1], times: [0, 0.45, 1] }}
      onAnimationComplete={() => setDone(true)}
    >
      <GrainOverlay tone="paper" />
      <motion.div
        className={veil()}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.85] }}
        transition={{ duration: 1.3, ease: "easeIn", times: [0, 0.45, 1] }}
      />
    </motion.div>
  );
}
