import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** A four-point star at (cx,cy); `delay` is a literal animation-delay class so the field twinkles out of phase. */
function Star({
  cx,
  cy,
  r,
  animate,
  delay,
}: {
  cx: number;
  cy: number;
  r: number;
  animate: boolean;
  delay: string;
}) {
  const k = r * 0.28;
  const d = `M ${cx} ${cy - r} L ${cx + k} ${cy - k} L ${cx + r} ${cy} L ${cx + k} ${cy + k} L ${cx} ${cy + r} L ${cx - k} ${cy + k} L ${cx - r} ${cy} L ${cx - k} ${cy - k} Z`;
  return (
    <path
      d={d}
      className={cn(
        "origin-center [transform-box:fill-box] fill-golden-hour stroke-ink-sepia/40",
        animate && "motion-safe:animate-twinkle",
        animate && delay,
      )}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  );
}

/** The starmap keepsake → the paper-sky scene: a cut-out square of night sky.
 *  The stars twinkle (and one shoots) until it's been seen. */
export function StarmapIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("h-full w-full drop-shadow-sticker", className)}
    >
      {/* paper-cut sticker edge around the night-sky card */}
      <rect
        x={12}
        y={18}
        width={76}
        height={64}
        rx={5}
        className="fill-paper-cream stroke-paper-cream"
        strokeWidth={5}
      />
      <rect x={12} y={18} width={76} height={64} rx={5} className="fill-night-paper" />
      {/* fold creases — the map has been opened many times */}
      <line x1={38} y1={18} x2={38} y2={82} className="stroke-silver-pen/15" strokeWidth={1} />
      <line x1={12} y1={54} x2={88} y2={54} className="stroke-silver-pen/15" strokeWidth={1} />
      {/* a crescent moon in the corner */}
      <path d="M76 22 A 7.5 7.5 0 1 0 76 37 A 6 6 0 1 1 76 22 Z" className="fill-golden-hour/70" />
      {/* the constellation, traced in silver pen */}
      <path
        d="M28 36 L56 28 L74 50 L46 64 L26 58"
        fill="none"
        className="stroke-silver-pen/40"
        strokeWidth={1.5}
        strokeDasharray="1 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* faint background stars */}
      <circle cx={20} cy={26} r={1} className="fill-silver-pen/70" />
      <circle cx={48} cy={42} r={0.8} className="fill-silver-pen/60" />
      <circle cx={64} cy={70} r={1.2} className="fill-silver-pen/70" />
      <circle cx={32} cy={74} r={0.9} className="fill-silver-pen/60" />
      <circle cx={80} cy={62} r={1} className="fill-silver-pen/70" />
      <circle cx={60} cy={20} r={0.8} className="fill-silver-pen/60" />
      {/* a shooting star, hidden most of its loop (opacity-0 rests it when frozen) */}
      <line
        x1={20}
        y1={22}
        x2={28}
        y2={28}
        strokeLinecap="round"
        className={cn(
          "stroke-silver-pen/90 opacity-0",
          animate && "motion-safe:animate-shooting-star",
        )}
        strokeWidth={1.2}
      />
      <Star cx={28} cy={36} r={7} animate={animate} delay="[animation-delay:0ms]" />
      <Star cx={56} cy={28} r={6} animate={animate} delay="[animation-delay:300ms]" />
      <Star cx={74} cy={50} r={7} animate={animate} delay="[animation-delay:600ms]" />
      <Star cx={46} cy={64} r={6} animate={animate} delay="[animation-delay:900ms]" />
      <Star cx={26} cy={58} r={5} animate={animate} delay="[animation-delay:1200ms]" />
    </svg>
  );
}
