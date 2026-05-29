import { seededTransformVars } from "@shared/lib/seededRotation";
import { tv, type VariantProps } from "tailwind-variants";

const washiTape = tv({
  base: "inline-block h-7 mix-blend-multiply shadow-tape [clip-path:polygon(2%_0,100%_3%,98%_100%,0_97%)] rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)]",
  variants: {
    tone: {
      rose: "bg-faded-rose/35",
      sage: "bg-sage-dust/45",
      teal: "bg-dusty-teal/35",
      kraft: "bg-kraft-tan/60",
      golden: "bg-golden-hour/40",
    },
    length: {
      sm: "w-16",
      md: "w-24",
      lg: "w-36",
    },
  },
  defaultVariants: { tone: "sage", length: "md" },
});

interface WashiTapeProps extends VariantProps<typeof washiTape> {
  /** stable id — drives the deterministic angle/offset */
  id: string;
  className?: string;
}

/**
 * A translucent strip of washi tape, blended onto the paper (multiply) with
 * slightly torn ends and a seeded angle. Purely decorative — it tapes other
 * props down, so it stays out of the accessibility tree.
 */
export function WashiTape({ id, tone, length, className }: WashiTapeProps) {
  return (
    <span
      aria-hidden="true"
      className={washiTape({ tone, length, class: className })}
      style={seededTransformVars(id)}
    />
  );
}
