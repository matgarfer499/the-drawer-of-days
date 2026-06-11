import { AnimatePresence, type MotionValue, motion, useSpring, useTransform } from "motion/react";
import { tv } from "tailwind-variants";
import type { BoxPhase } from "./dragToOpen";

const ribbon = tv({
  slots: {
    svg: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
    band: "opacity-95",
    loop: "stroke-rose-deep/40 stroke-[1.5] [transform-box:fill-box]",
    loopGlint: "fill-none stroke-paper-cream/40 stroke-[1.5]",
    knot: "[transform-box:fill-box]",
    // scale/rotate around the element's own bbox (not the SVG viewport origin)
    originBox: "[transform-box:fill-box]",
    tail: "fill-none stroke-faded-rose stroke-[7] [stroke-linecap:round]",
    tailGlint: "fill-none stroke-paper-cream/30 stroke-[2] [stroke-linecap:round]",
    stopEdge: "[stop-color:var(--color-rose-deep)]",
    stopMid: "[stop-color:var(--color-faded-rose)]",
    stopGlint: "[stop-color:var(--color-paper-cream)]",
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
 * as one slack piece. The bands carry a satin sheen (a cream glint down the centre
 * of each gradient) and the tails a thin highlight, so the ribbon reads as fabric,
 * not flat ink. Purely decorative; it only reacts to the scene's values. `aria-hidden`.
 */
export function Ribbon({ pull, untie, phase }: RibbonProps) {
  const {
    svg,
    band,
    loop,
    loopGlint,
    knot,
    originBox,
    tail,
    tailGlint,
    stopEdge,
    stopMid,
    stopGlint,
  } = ribbon();
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
      <defs>
        {/* satin: deep edges, a soft cream glint down the centre line */}
        <linearGradient id="ribbon-satin-v" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" className={stopEdge()} />
          <stop offset="0.45" className={stopMid()} />
          <stop offset="0.5" className={stopGlint()} stopOpacity="0.7" />
          <stop offset="0.55" className={stopMid()} />
          <stop offset="1" className={stopEdge()} />
        </linearGradient>
        <linearGradient id="ribbon-satin-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={stopEdge()} />
          <stop offset="0.45" className={stopMid()} />
          <stop offset="0.5" className={stopGlint()} stopOpacity="0.7" />
          <stop offset="0.55" className={stopMid()} />
          <stop offset="1" className={stopEdge()} />
        </linearGradient>
        <radialGradient id="ribbon-knot-sheen" cx="0.35" cy="0.35" r="0.85">
          <stop offset="0" className={stopMid()} />
          <stop offset="1" className={stopEdge()} />
        </radialGradient>
      </defs>

      <AnimatePresence>
        {present && (
          <motion.g
            initial={false}
            exit={{ opacity: 0, y: 64, transition: { duration: 0.5, ease: "easeIn" } }}
          >
            {/* the cross bands wrapping the box — they slip off with the rest */}
            <rect
              className={band()}
              fill="url(#ribbon-satin-v)"
              x="42"
              y="0"
              width="16"
              height="100"
            />
            <rect
              className={band()}
              fill="url(#ribbon-satin-h)"
              x="0"
              y="42"
              width="100"
              height="16"
            />

            {/* tails, drawn through the knot (anchored at its top) as it unties;
                each carries a thin off-centre glint that sways with it */}
            <motion.g
              className={originBox()}
              style={{ rotate: tailRotate, scaleY: tailScaleY, originX: 0.5, originY: 0 }}
            >
              <path className={tail()} d="M48 50 C 44 68, 41 82, 39 96" />
              <path className={tail()} d="M52 50 C 56 68, 59 82, 61 96" />
              <path className={tailGlint()} d="M46.5 51 C 42.5 68, 39.5 82, 37.8 95" />
              <path className={tailGlint()} d="M53.5 51 C 57.5 68, 60.5 82, 62.2 95" />
            </motion.g>

            {/* the two bow loops collapse into the knot */}
            <motion.g
              className={originBox()}
              style={{ scale: loopScale, originX: 0.5, originY: 0.5 }}
            >
              <path
                className={loop()}
                fill="url(#ribbon-knot-sheen)"
                d="M50 50 C 26 30, 8 44, 18 56 C 26 64, 44 56, 50 50 Z"
              />
              <path
                className={loop()}
                fill="url(#ribbon-knot-sheen)"
                d="M50 50 C 74 30, 92 44, 82 56 C 74 64, 56 56, 50 50 Z"
              />
              <path className={loopGlint()} d="M47 49 C 28 34, 14 44, 21 54" />
              <path className={loopGlint()} d="M53 49 C 72 34, 86 44, 79 54" />
            </motion.g>

            {/* the central knot */}
            <motion.rect
              className={knot()}
              fill="url(#ribbon-knot-sheen)"
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
