import type { ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const paperFrame = tv({
  base: "relative rounded-sm",
  variants: {
    tone: {
      cream: "bg-paper-cream text-ink-sepia",
      kraft: "bg-kraft-tan text-ink-sepia",
      night: "bg-night-paper text-silver-pen",
    },
    elevation: {
      flat: "shadow-none",
      resting: "shadow-paper",
      lifted: "shadow-paper-lifted",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-5",
      lg: "p-8",
    },
  },
  defaultVariants: { tone: "cream", elevation: "resting", padding: "md" },
});

interface PaperFrameProps extends VariantProps<typeof paperFrame> {
  children: ReactNode;
  className?: string;
}

/**
 * A sheet of paper — the base surface for letters, cards and labels. Long text
 * scrolls *inside* one of these (the page itself never scrolls). Other props
 * (polaroids, tape, stamps) are arranged on top of it.
 */
export function PaperFrame({ tone, elevation, padding, className, children }: PaperFrameProps) {
  return (
    <div className={paperFrame({ tone, elevation, padding, class: className })}>{children}</div>
  );
}
