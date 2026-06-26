import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** The recetario keepsake → the recipes scene. A pot with cutlery rising out of it,
 *  still steaming, until the scene has been seen. */
export function RecetarioIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("h-full w-full drop-shadow-sticker", className)}
    >
      {/* the pot's side handles (drawn first so the body laps over their inner edge) */}
      <rect
        x={17}
        y={62}
        width={11}
        height={8}
        rx={4}
        className="fill-aged-tan stroke-ink-sepia"
        strokeWidth={2.5}
      />
      <rect
        x={72}
        y={62}
        width={11}
        height={8}
        rx={4}
        className="fill-aged-tan stroke-ink-sepia"
        strokeWidth={2.5}
      />

      {/* the dark mouth of the pot — the opening the cutlery stand in */}
      <ellipse
        cx={50}
        cy={58}
        rx={24}
        ry={5}
        className="fill-aged-tan/80 stroke-ink-sepia"
        strokeWidth={2.5}
      />

      {/* a spoon, leaning left, bobbing up out of the pot */}
      <g className={cn(animate && "motion-safe:animate-cutlery-rise")}>
        <line
          x1={43}
          y1={60}
          x2={37}
          y2={30}
          className="stroke-aged-tan"
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <ellipse
          cx={36}
          cy={25}
          rx={4.5}
          ry={6}
          className="fill-paper-cream stroke-ink-sepia"
          strokeWidth={2}
        />
      </g>

      {/* a fork, leaning right, bobbing a beat later */}
      <g
        className={cn(
          animate && "motion-safe:animate-cutlery-rise",
          animate && "[animation-delay:550ms]",
        )}
      >
        <line
          x1={57}
          y1={60}
          x2={62}
          y2={31}
          className="stroke-aged-tan"
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <g className="stroke-ink-sepia" strokeWidth={2} strokeLinecap="round" fill="none">
          <line x1={59} y1={29} x2={58.5} y2={20} />
          <line x1={62.5} y1={29} x2={62.5} y2={19} />
          <line x1={66} y1={29} x2={66.5} y2={20} />
        </g>
        <line
          x1={58}
          y1={29}
          x2={66.5}
          y2={29}
          className="stroke-aged-tan"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>

      {/* the pot body, over the cutlery's lower ends — paper-cut sticker edge first */}
      <rect
        x={27}
        y={58}
        width={46}
        height={27}
        rx={7}
        className="fill-paper-cream stroke-paper-cream"
        strokeWidth={5}
      />
      <rect
        x={27}
        y={58}
        width={46}
        height={27}
        rx={7}
        className="fill-kraft-tan stroke-ink-sepia"
        strokeWidth={3}
      />
      {/* a lip highlight band and a little stitched heart, lived-on */}
      <rect x={27} y={58} width={46} height={8} rx={6} className="fill-aged-tan/40" />
      <path
        d="M50 79 C 47 76, 45.5 74, 47.4 72.4 C 48.6 71.5, 50 72.6, 50 73.6 C 50 72.6, 51.4 71.5, 52.6 72.4 C 54.5 74, 53 76, 50 79 Z"
        className="fill-faded-rose/70"
      />

      {/* steam curls drifting up from the pot (opacity-0 rests them when frozen) */}
      <g
        fill="none"
        className={cn("stroke-faded-ink/60 opacity-0", animate && "motion-safe:animate-steam-rise")}
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <path d="M45 50 C 43 47, 47 45, 45 42" />
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
        <path d="M52 49 C 50 46, 54 44, 52 41" />
      </g>
    </svg>
  );
}
