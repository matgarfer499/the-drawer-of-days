import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** The envelope keepsake → the letter scene. The flap folds open and the letter
 *  rises out in a slow loop — the letter is clipped to the envelope's mouth, so it's
 *  hidden inside and only shows the part that peeks out. Freezes (closed) once seen. */
export function EnvelopeIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("h-full w-full drop-shadow-sticker", className)}
    >
      {/* the letter only exists above the envelope's mouth (y ≤ 36); the rest is
          "inside" and clipped away, so at rest it's invisible */}
      <defs>
        <clipPath id="carta-mouth">
          <rect x={0} y={0} width={100} height={36} />
        </clipPath>
      </defs>

      {/* the envelope body — paper-cut sticker edge, then the pocket */}
      <rect
        x={14}
        y={36}
        width={72}
        height={38}
        rx={4}
        className="fill-paper-cream stroke-paper-cream"
        strokeWidth={5}
      />
      <rect
        x={14}
        y={36}
        width={72}
        height={38}
        rx={4}
        className="fill-paper-cream stroke-ink-sepia"
        strokeWidth={3}
      />
      {/* a stitched inset border + a little sage stamp in the corner */}
      <rect
        x={18}
        y={40}
        width={64}
        height={30}
        rx={2}
        fill="none"
        className="stroke-aged-tan/55 [stroke-dasharray:3_3]"
        strokeWidth={1.5}
      />
      <g className="origin-center rotate-3 [transform-box:fill-box]">
        <rect
          x={67}
          y={57}
          width={12}
          height={13}
          className="fill-paper-cream stroke-aged-tan/70"
          strokeWidth={1}
        />
        <rect x={69} y={59} width={8} height={9} className="fill-sage-dust/60" />
      </g>

      {/* the letter — rises up out of the mouth while the flap is open, then tucks back */}
      <g clipPath="url(#carta-mouth)">
        <g className={cn(animate && "motion-safe:animate-letter-rise")}>
          <rect
            x={29}
            y={38}
            width={42}
            height={34}
            rx={2}
            className="fill-paper-cream stroke-aged-tan/70"
            strokeWidth={1.5}
          />
          <line
            x1={35}
            y1={45}
            x2={65}
            y2={45}
            className="stroke-faded-ink/55"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* a small rose heart near the top of the page, so it shows as it peeks */}
          <path
            d="M50 56 C 46.5 52.5, 45 50.5, 47.2 48.6 C 48.6 47.6, 50 48.8, 50 50 C 50 48.8, 51.4 47.6, 52.8 48.6 C 55 50.5, 53.5 52.5, 50 56 Z"
            className="fill-faded-rose/75"
          />
        </g>
      </g>

      {/* the flap — folds flat to open about its top hinge and seals again, the wax
          seal riding it */}
      <g
        className={cn(
          "origin-top [transform-box:fill-box]",
          animate && "motion-safe:animate-envelope-open",
        )}
      >
        <path
          d="M14 36 L50 58 L86 36 Z"
          className="fill-faded-rose/30 stroke-rose-deep"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <g
          className={cn(
            "origin-center [transform-box:fill-box]",
            animate && "motion-safe:animate-seal-pulse",
          )}
        >
          <circle
            cx={50}
            cy={47}
            r={7}
            className="fill-faded-rose stroke-rose-deep"
            strokeWidth={1.5}
          />
          <path
            d="M50 50.5 C 47.4 48, 46.2 46.2, 47.9 44.7 C 49 43.9, 50 44.8, 50 45.6 C 50 44.8, 51 43.9, 52.1 44.7 C 53.8 46.2, 52.6 48, 50 50.5 Z"
            className="fill-paper-cream"
          />
        </g>
      </g>
    </svg>
  );
}
