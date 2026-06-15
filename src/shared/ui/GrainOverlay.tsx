import { tv } from "tailwind-variants";

const grain = tv({
  base: "pointer-events-none absolute inset-0 rounded-[inherit] bg-grain bg-repeat",
  variants: {
    tone: {
      paper: "opacity-[0.05] mix-blend-multiply",
      night: "opacity-[0.08] mix-blend-soft-light",
    },
  },
  defaultVariants: { tone: "paper" },
});

interface GrainOverlayProps {
  tone?: "paper" | "night";
  className?: string;
}

/**
 * A film of paper grain laid over a surface — the pre-rasterized noise tile from
 * `bg-grain`, blended into whatever sits beneath. Purely decorative; it inherits
 * the parent's radius so it clips to cards, lids and frames. The parent must be
 * positioned (relative/absolute).
 */
export function GrainOverlay({ tone = "paper", className }: GrainOverlayProps) {
  return <div aria-hidden="true" className={grain({ tone, class: className })} />;
}
