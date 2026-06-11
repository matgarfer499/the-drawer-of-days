import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** The recetario keepsake → the recipes scene. The cards peek out of the box until it's been seen. */
export function RecetarioIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("h-full w-full", className)}>
      {/* a recipe card peeking from the box */}
      <g className={cn(animate && "motion-safe:animate-peek", animate && "[animation-delay:0ms]")}>
        <rect
          x={26}
          y={26}
          width={48}
          height={36}
          rx={3}
          className="fill-paper-cream stroke-ink-sepia"
          strokeWidth={2.5}
        />
        <line
          x1={33}
          y1={36}
          x2={67}
          y2={36}
          className="stroke-faded-ink/60"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={33}
          y1={42}
          x2={60}
          y2={42}
          className="stroke-faded-ink/45"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </g>
      {/* a second card tab, peeking a beat later */}
      <g
        className={cn(animate && "motion-safe:animate-peek", animate && "[animation-delay:450ms]")}
      >
        <rect
          x={36}
          y={22}
          width={40}
          height={20}
          rx={3}
          className="fill-faded-rose/25 stroke-rose-deep"
          strokeWidth={2.5}
        />
      </g>
      {/* the box front, over the cards' lower edge */}
      <rect
        x={12}
        y={50}
        width={76}
        height={32}
        rx={5}
        className="fill-kraft-tan stroke-ink-sepia"
        strokeWidth={3}
      />
      <rect x={12} y={50} width={76} height={9} rx={4} className="fill-aged-tan/40" />
      <rect
        x={44}
        y={62}
        width={12}
        height={5}
        rx={2}
        className="fill-paper-cream stroke-ink-sepia"
        strokeWidth={1.5}
      />
    </svg>
  );
}
