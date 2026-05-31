import { AnimatePresence, type MotionValue, motion, useSpring, useTransform } from "motion/react";
import { tv } from "tailwind-variants";
import type { BoxPhase } from "./dragToOpen";

const ribbon = tv({
  slots: {
    svg: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
    band: "fill-faded-rose/80",
    loop: "fill-faded-rose stroke-rose-deep/40 stroke-[1.5] [transform-box:fill-box]",
    knot: "fill-rose-deep [transform-box:fill-box]",
    // scale/rotate around the element's own bbox (not the SVG viewport origin)
    originBox: "[transform-box:fill-box]",
    tail: "fill-none stroke-faded-rose stroke-[7] [stroke-linecap:round]",
  },
});

interface RibbonProps {
  /** live horizontal drag offset of the knot, in px */
  pull: MotionValue<number>;
  /** 0 = tied bow, 1 = fully undone (loops pulled through the knot) */
  untie: MotionValue<number>;
  phase: BoxPhase;
}

/**
 * The satin ribbon drawn over the box: a cross of bands, a centred bow and two
 * tails. As you pull the knot the loops loosen; releasing past the threshold runs
 * `untie` 0→1, which draws the loops *into* the knot and lengthens the tails — the
 * bow coming undone — and then the whole ribbon (bands and all) slides off the box
 * as one slack piece. Purely decorative; it only reacts to the scene's values.
 * `aria-hidden`.
 */
export function Ribbon({ pull, untie, phase }: RibbonProps) {
  const { svg, band, loop, knot, originBox, tail } = ribbon();
  const present = phase === "tied" || phase === "untying";

  // soft, springy follow of the pull for the dangling tails
  const sway = useSpring(pull, { stiffness: 120, damping: 14, mass: 0.6 });
  const tailRotate = useTransform(sway, [-140, 0, 140], [12, 0, -12]);
  // as the knot comes undone the tails are drawn through: they lengthen and droop
  const tailScaleY = useTransform(untie, [0, 1], [1, 1.55]);
  // loops loosen with the pull, then collapse into the knot as it unties
  const loopScale = useTransform(() => {
    const loosened = 1 - Math.min(Math.abs(pull.get()) / 140, 1) * 0.4;
    return loosened * (1 - untie.get());
  });
  // the knot gives a little tug as it slips undone
  const knotScale = useTransform(untie, [0, 0.35, 1], [1, 1.18, 0.82]);
  const knotRotate = useTransform(pull, [-140, 0, 140], [-10, 0, 10]);

  return (
    <svg className={svg()} viewBox="0 0 100 100" aria-hidden="true">
      <AnimatePresence>
        {present && (
          <motion.g
            initial={false}
            exit={{ opacity: 0, y: 64, transition: { duration: 0.5, ease: "easeIn" } }}
          >
            {/* the cross bands wrapping the box — they slip off with the rest */}
            <rect className={band()} x="42" y="0" width="16" height="100" />
            <rect className={band()} x="0" y="42" width="100" height="16" />

            {/* tails, drawn through the knot (anchored at its top) as it unties */}
            <motion.g
              className={originBox()}
              style={{ rotate: tailRotate, scaleY: tailScaleY, originX: 0.5, originY: 0 }}
            >
              <path className={tail()} d="M48 50 C 44 68, 41 82, 39 96" />
              <path className={tail()} d="M52 50 C 56 68, 59 82, 61 96" />
            </motion.g>

            {/* the two bow loops collapse into the knot */}
            <motion.g
              className={originBox()}
              style={{ scale: loopScale, originX: 0.5, originY: 0.5 }}
            >
              <path className={loop()} d="M50 50 C 26 30, 8 44, 18 56 C 26 64, 44 56, 50 50 Z" />
              <path className={loop()} d="M50 50 C 74 30, 92 44, 82 56 C 74 64, 56 56, 50 50 Z" />
            </motion.g>

            {/* the central knot */}
            <motion.rect
              className={knot()}
              x="43"
              y="43"
              width="14"
              height="14"
              rx="4"
              style={{ scale: knotScale, rotate: knotRotate, originX: 0.5, originY: 0.5 }}
            />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}
