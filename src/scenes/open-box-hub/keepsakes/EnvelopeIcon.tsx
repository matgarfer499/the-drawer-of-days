import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** The envelope keepsake → the letter scene. It opens and closes in a slow loop, the
 *  letter sliding up out of the envelope, until the scene has been seen. */
export function EnvelopeIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("h-full w-full drop-shadow-sticker", className)}
    >
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

      {/* the letter inside — slides up while the flap is open, then tucks back */}
      <g className={cn(animate && "motion-safe:animate-letter-rise")}>
        <rect
          x={29}
          y={40}
          width={42}
          height={30}
          rx={2}
          className="fill-paper-cream stroke-aged-tan/70"
          strokeWidth={1.5}
        />
        <line
          x1={34}
          y1={48}
          x2={66}
          y2={48}
          className="stroke-faded-ink/55"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={34}
          y1={54}
          x2={58}
          y2={54}
          className="stroke-faded-ink/40"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* a small rose heart on the page */}
        <path
          d="M50 64 C 46.5 60.5, 45 58.5, 47.2 56.6 C 48.6 55.6, 50 56.8, 50 58 C 50 56.8, 51.4 55.6, 52.8 56.6 C 55 58.5, 53.5 60.5, 50 64 Z"
          className="fill-faded-rose/70"
        />
      </g>

      {/* the front pocket, tucking the letter's lower half in */}
      <path
        d="M14 74 L50 54 L86 74 Z"
        className="fill-paper-cream stroke-ink-sepia/70"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* a stitched inset border + a little sage stamp in the corner */}
      <g className="origin-center rotate-3 [transform-box:fill-box]">
        <rect
          x={67}
          y={58}
          width={12}
          height={13}
          className="fill-paper-cream stroke-aged-tan/70"
          strokeWidth={1}
        />
        <rect x={69} y={60} width={8} height={9} className="fill-sage-dust/60" />
      </g>

      {/* the flap — lifts open about its top hinge and seals again, in step with the
          letter; the wax seal rides it */}
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
            cy={48}
            r={7}
            className="fill-faded-rose stroke-rose-deep"
            strokeWidth={1.5}
          />
          <path
            d="M50 51.5 C 47.4 49, 46.2 47.2, 47.9 45.7 C 49 44.9, 50 45.8, 50 46.6 C 50 45.8, 51 44.9, 52.1 45.7 C 53.8 47.2, 52.6 49, 50 51.5 Z"
            className="fill-paper-cream"
          />
        </g>
      </g>
    </svg>
  );
}
