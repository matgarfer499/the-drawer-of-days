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

/** The starmap keepsake → the paper-sky scene. The stars twinkle until it's been seen. */
export function StarmapIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("h-full w-full", className)}>
      <path
        d="M28 36 L56 28 L74 50 L46 64 L26 58"
        fill="none"
        className="stroke-ink-sepia/30"
        strokeWidth={1.5}
        strokeDasharray="1 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Star cx={28} cy={36} r={7} animate={animate} delay="[animation-delay:0ms]" />
      <Star cx={56} cy={28} r={6} animate={animate} delay="[animation-delay:300ms]" />
      <Star cx={74} cy={50} r={7} animate={animate} delay="[animation-delay:600ms]" />
      <Star cx={46} cy={64} r={6} animate={animate} delay="[animation-delay:900ms]" />
      <Star cx={26} cy={58} r={5} animate={animate} delay="[animation-delay:1200ms]" />
    </svg>
  );
}
