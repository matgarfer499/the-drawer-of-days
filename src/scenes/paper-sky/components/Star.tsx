import { seededTransformVars } from "@shared/lib/seededRotation";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";

const star = tv({
  slots: {
    button:
      "absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full left-[var(--star-x)] top-[var(--star-y)] focus-visible:outline-2 focus-visible:outline-silver-pen focus-visible:outline-offset-2",
    glyph: "h-10 w-10 rotate-[var(--seed-rot)] transition-[filter,fill]",
  },
  variants: {
    lit: {
      true: {
        glyph: "fill-golden-hour [filter:drop-shadow(0_0_8px_var(--color-golden-hour))]",
      },
      false: { glyph: "fill-silver-pen/20 stroke-silver-pen/70" },
    },
  },
  defaultVariants: { lit: false },
});

// A five-point star cut by hand — every vertex slightly off where it "should" be.
const STAR_PATH =
  "M20 3 L24.8 14.2 L37 15.4 L28 23.6 L30.8 35.6 L20.4 29.2 L9.6 35.2 L12.4 23.4 L3.4 15 L15.4 14.4 Z";

interface StarProps {
  label: string;
  /** viewport position, 0–100 per axis */
  x: number;
  y: number;
  lit: boolean;
  reduced: boolean;
  onToggle: () => void;
}

/**
 * A cut-out paper star pinned to the sky at its place's coordinates. Tapping it
 * lights (or dims) it — a forgiving toggle, never a puzzle. Hollow with a pale
 * outline when dim, solid gold with a glow when lit (a non-colour state cue).
 * The position is the only dynamic style, injected as CSS variables (the
 * sanctioned exception), alongside a per-star seeded tilt.
 */
export function Star({ label, x, y, lit, reduced, onToggle }: StarProps) {
  const { button, glyph } = star({ lit });
  const vars: Record<`--${string}`, string> = {
    "--star-x": `${x}%`,
    "--star-y": `${y}%`,
    ...seededTransformVars(label, { maxRotation: 14, maxOffset: 0 }),
  };
  return (
    <motion.button
      type="button"
      className={button()}
      style={vars}
      onClick={onToggle}
      aria-pressed={lit}
      aria-label={`${lit ? "Apagar" : "Encender"} ${label}`}
      whileTap={reduced ? {} : { scale: 0.8 }}
      animate={reduced ? {} : lit ? { scale: [1, 1.3, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true" className={glyph()}>
        <path d={STAR_PATH} strokeWidth={3} strokeLinejoin="round" paintOrder="stroke" />
      </svg>
    </motion.button>
  );
}
