import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** The envelope keepsake → the letter scene. Its flap breathes open until it's been seen. */
export function EnvelopeIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("h-full w-full", className)}>
      <rect
        x={14}
        y={34}
        width={72}
        height={40}
        rx={4}
        className="fill-paper-cream stroke-ink-sepia"
        strokeWidth={3}
      />
      <path
        d="M14 34 L50 58 L86 34"
        fill="none"
        className="stroke-ink-sepia/50"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <g
        className={cn(
          "origin-top [transform-box:fill-box]",
          animate && "motion-safe:animate-flap-breathe",
        )}
      >
        <path
          d="M14 34 L50 56 L86 34 Z"
          className="fill-faded-rose/30 stroke-rose-deep"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <circle cx={50} cy={42} r={3.2} className="fill-rose-deep" />
      </g>
    </svg>
  );
}
