import { motion } from "motion/react";
import { tv } from "tailwind-variants";

const star = tv({
  slots: {
    button:
      "absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full left-[var(--star-x)] top-[var(--star-y)] focus-visible:outline-2 focus-visible:outline-silver-pen focus-visible:outline-offset-2",
    glyph: "text-2xl leading-none transition-colors",
  },
  variants: {
    lit: {
      true: { glyph: "text-golden-hour [text-shadow:0_0_10px_var(--color-golden-hour)]" },
      false: { glyph: "text-silver-pen/60" },
    },
  },
  defaultVariants: { lit: false },
});

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
 * lights (or dims) it — a forgiving toggle, never a puzzle. The position is the
 * only dynamic style, injected as CSS variables (the sanctioned exception).
 */
export function Star({ label, x, y, lit, reduced, onToggle }: StarProps) {
  const { button, glyph } = star({ lit });
  const position: Record<`--${string}`, string> = { "--star-x": `${x}%`, "--star-y": `${y}%` };
  return (
    <motion.button
      type="button"
      className={button()}
      style={position}
      onClick={onToggle}
      aria-pressed={lit}
      aria-label={`${lit ? "Apagar" : "Encender"} ${label}`}
      whileTap={reduced ? {} : { scale: 0.8 }}
      animate={reduced ? {} : lit ? { scale: [1, 1.3, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <span aria-hidden="true" className={glyph()}>
        ✦
      </span>
    </motion.button>
  );
}
