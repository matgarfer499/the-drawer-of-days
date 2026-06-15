import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** The recetario keepsake → the recipes scene. The cards peek out of the box —
 *  and something is still steaming — until it's been seen. */
export function RecetarioIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("h-full w-full drop-shadow-sticker", className)}
    >
      {/* steam curls drift up from the box (opacity-0 rests them when frozen) */}
      <g
        fill="none"
        className={cn("stroke-faded-ink/60 opacity-0", animate && "motion-safe:animate-steam-rise")}
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <path d="M17 46 C 15 43, 19 41, 17 38" />
      </g>
      <g
        fill="none"
        className={cn(
          "stroke-faded-ink/50 opacity-0",
          animate && "motion-safe:animate-steam-rise [animation-delay:1.8s]",
        )}
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <path d="M22 48 C 20 45, 24 43, 22 40" />
      </g>

      {/* a recipe card peeking from the box */}
      <g className={cn(animate && "motion-safe:animate-peek", animate && "[animation-delay:0ms]")}>
        <rect
          x={26}
          y={26}
          width={48}
          height={36}
          rx={3}
          className="fill-paper-cream stroke-paper-cream"
          strokeWidth={5}
        />
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

      {/* more card edges crowd the box under the lip */}
      <rect
        x={30}
        y={45}
        width={44}
        height={6}
        rx={2}
        className="fill-paper-cream stroke-aged-tan/60"
        strokeWidth={1}
      />
      <rect x={34} y={47} width={36} height={5} rx={2} className="fill-paper-cream/80" />

      {/* a wooden spoon leans against the box */}
      <g className="origin-center [transform-box:fill-box]">
        <line
          x1={84}
          y1={30}
          x2={78}
          y2={54}
          className="stroke-aged-tan"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <ellipse cx={85.5} cy={25} rx={4} ry={5.5} className="fill-aged-tan" />
      </g>

      {/* the box front, over the cards' lower edge — paper-cut sticker edge first */}
      <rect
        x={12}
        y={50}
        width={76}
        height={32}
        rx={5}
        className="fill-paper-cream stroke-paper-cream"
        strokeWidth={5}
      />
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
