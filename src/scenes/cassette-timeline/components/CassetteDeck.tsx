import { type MotionValue, motion } from "motion/react";
import { tv } from "tailwind-variants";

const deck = tv({
  slots: {
    root: "relative mx-auto flex h-20 w-full max-w-[16rem] items-center justify-between rounded-lg border-2 border-aged-tan/50 bg-kraft-tan/40 px-7 shadow-paper",
    window:
      "pointer-events-none absolute inset-x-5 top-1/2 h-9 -translate-y-1/2 rounded-sm bg-ink-sepia/10",
    reel: "relative grid h-12 w-12 place-items-center rounded-full border-2 border-aged-tan/60 bg-paper-cream",
    spokes: "absolute inset-1 grid place-items-center",
    spoke: "absolute h-full w-[2px] rounded bg-aged-tan/50",
    hub: "z-10 h-3.5 w-3.5 rounded-full bg-aged-tan/70",
    glow: "pointer-events-none absolute -inset-1 rounded-full bg-golden-hour/60 blur-md",
  },
  variants: {
    // each spoke's fixed angle — the three together make a six-pointed reel star
    angle: {
      "0": { spoke: "rotate-0" },
      "60": { spoke: "rotate-[60deg]" },
      "120": { spoke: "rotate-[120deg]" },
    },
  },
});

const SPOKE_ANGLES = ["0", "60", "120"] as const;

interface CassetteDeckProps {
  /** drives reel spin; omit (reduced motion) for still reels */
  rotate?: MotionValue<number>;
  /** the scrub "whirr" glow, 0–1; omit (reduced motion) for no glow */
  glow?: MotionValue<number>;
}

/**
 * The cassette body: two reels that spin with the scroll and whirr gold the
 * faster you scrub. Purely decorative — the real content is the tape's tracks —
 * so it stays out of the accessibility tree. Under reduced motion both motion
 * values are omitted and the reels rest still. (Motion values must bind through
 * `style`, the sanctioned dynamic exception to the no-inline-style rule.)
 */
export function CassetteDeck({ rotate, glow }: CassetteDeckProps) {
  const { root, window: windowSlot, reel, spokes, spoke, hub, glow: glowSlot } = deck();
  const bars = SPOKE_ANGLES.map((angle) => <span key={angle} className={spoke({ angle })} />);
  return (
    <div className={root()} aria-hidden="true">
      <span className={windowSlot()} />
      {[0, 1].map((side) => (
        <span key={side} className={reel()}>
          {glow ? <motion.span className={glowSlot()} style={{ opacity: glow }} /> : null}
          {rotate ? (
            <motion.span className={spokes()} style={{ rotate }}>
              {bars}
            </motion.span>
          ) : (
            <span className={spokes()}>{bars}</span>
          )}
          <span className={hub()} />
        </span>
      ))}
    </div>
  );
}
