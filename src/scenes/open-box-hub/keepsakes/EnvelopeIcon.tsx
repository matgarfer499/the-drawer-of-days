import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** The envelope keepsake → the letter scene. Its flap breathes open until it's been seen. */
export function EnvelopeIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("h-full w-full drop-shadow-sticker", className)}
    >
      {/* paper-cut sticker edge */}
      <rect
        x={14}
        y={34}
        width={72}
        height={40}
        rx={4}
        className="fill-paper-cream stroke-paper-cream"
        strokeWidth={5}
      />
      <rect
        x={14}
        y={34}
        width={72}
        height={40}
        rx={4}
        className="fill-paper-cream stroke-ink-sepia"
        strokeWidth={3}
      />
      {/* a stitched inset border, like a kept envelope sewn into an album */}
      <rect
        x={18}
        y={38}
        width={64}
        height={32}
        rx={2}
        fill="none"
        className="stroke-aged-tan/60 [stroke-dasharray:3_3]"
        strokeWidth={1.5}
      />
      {/* a little sage stamp in the lower corner */}
      <g className="origin-center rotate-3 [transform-box:fill-box]">
        <rect
          x={67}
          y={56}
          width={12}
          height={13}
          className="fill-paper-cream stroke-aged-tan/70"
          strokeWidth={1}
        />
        <rect x={69} y={58} width={8} height={9} className="fill-sage-dust/60" />
      </g>
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
        {/* the wax seal, swelling like a slow heartbeat */}
        <g
          className={cn(
            "origin-center [transform-box:fill-box]",
            animate && "motion-safe:animate-seal-pulse",
          )}
        >
          <circle
            cx={50}
            cy={42}
            r={7}
            className="fill-faded-rose stroke-rose-deep"
            strokeWidth={1.5}
          />
          <path
            d="M50 45.5 C 47.4 43, 46.2 41.2, 47.9 39.7 C 49 38.9, 50 39.8, 50 40.6 C 50 39.8, 51 38.9, 52.1 39.7 C 53.8 41.2, 52.6 43, 50 45.5 Z"
            className="fill-paper-cream"
          />
        </g>
      </g>
    </svg>
  );
}
