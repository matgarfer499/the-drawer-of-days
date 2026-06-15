import { seededTransformVars } from "@shared/lib/seededRotation";
import { tv, type VariantProps } from "tailwind-variants";

const doodle = tv({
  slots: {
    root: "pointer-events-none inline-block rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)]",
    svg: "h-full w-full fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]",
  },
  variants: {
    tone: {
      ink: { root: "text-ink-sepia/25" },
      rose: { root: "text-faded-rose/40" },
      sage: { root: "text-sage-dust/45" },
      silver: { root: "text-silver-pen/30" },
    },
    size: {
      sm: { root: "h-5 w-5" },
      md: { root: "h-8 w-8" },
      lg: { root: "h-14 w-14" },
    },
  },
  defaultVariants: { tone: "ink", size: "md" },
});

// Deliberately wobbly pencil strokes — drawn freehand, never geometric.
const DOODLE_PATHS = {
  heart:
    "M12 19 C 7.2 14.4 4.4 11.6 4.6 8.8 C 4.8 6.2 6.8 4.8 8.6 5.2 C 10.2 5.5 11.2 6.8 12 8.2 C 12.9 6.7 14.1 5.4 15.8 5.1 C 17.7 4.8 19.5 6.4 19.4 8.9 C 19.3 11.7 16.6 14.5 12 19 Z",
  asterisk: "M12 4.4 L11.8 19.6 M5.2 8.2 L18.8 16 M18.6 7.8 L5.4 16.2",
  spiral: "M13 11.2 a1.8 1.8 0 1 1 -2.2 2 a3.8 3.8 0 1 0 4.4 -4.2 a6 6 0 1 0 -6.4 9",
  wave: "M3 14 q 3 -5 6 -0.4 t 6 0.2 t 6 -0.6",
} as const;

interface DoodleProps extends VariantProps<typeof doodle> {
  /** stable id — drives the deterministic tilt */
  id: string;
  kind: keyof typeof DOODLE_PATHS;
  className?: string;
}

/**
 * A pencil scribble in the page margin — a heart, an asterisk, a spiral, a
 * little wave. Faint, seeded-askew and purely decorative: the marks someone
 * leaves on a page they've lived with.
 */
export function Doodle({ id, kind, tone, size, className }: DoodleProps) {
  const { root, svg } = doodle({ tone, size });
  return (
    <span
      aria-hidden="true"
      className={root({ class: className })}
      style={seededTransformVars(id, { maxRotation: 10, maxOffset: 2 })}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={svg()} strokeWidth={1.6}>
        <path d={DOODLE_PATHS[kind]} />
      </svg>
    </span>
  );
}
