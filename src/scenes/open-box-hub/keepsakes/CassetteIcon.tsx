import { cn } from "@shared/lib/cn";
import type { KeepsakeIconProps } from "./types";

/** One cassette reel — a hub spoke spins it while the timeline is unseen. */
function Reel({ cx, cy, animate }: { cx: number; cy: number; animate: boolean }) {
  return (
    <g
      className={cn(
        "origin-center [transform-box:fill-box]",
        animate && "motion-safe:animate-reel-spin",
      )}
    >
      <circle
        cx={cx}
        cy={cy}
        r={9}
        className="fill-paper-cream stroke-ink-sepia"
        strokeWidth={2.5}
      />
      <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} className="stroke-ink-sepia" strokeWidth={2} />
      <line x1={cx - 9} y1={cy} x2={cx + 9} y2={cy} className="stroke-ink-sepia" strokeWidth={2} />
      <line
        x1={cx - 6.4}
        y1={cy - 6.4}
        x2={cx + 6.4}
        y2={cy + 6.4}
        className="stroke-ink-sepia"
        strokeWidth={2}
      />
      <line
        x1={cx - 6.4}
        y1={cy + 6.4}
        x2={cx + 6.4}
        y2={cy - 6.4}
        className="stroke-ink-sepia"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={2.6} className="fill-ink-sepia" />
    </g>
  );
}

/** The cassette keepsake → the timeline scene. The reels turn until it's been seen. */
export function CassetteIcon({ animate, className }: KeepsakeIconProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("h-full w-full", className)}>
      <rect
        x={10}
        y={24}
        width={80}
        height={52}
        rx={8}
        className="fill-kraft-tan stroke-ink-sepia"
        strokeWidth={3}
      />
      <rect
        x={20}
        y={32}
        width={60}
        height={26}
        rx={3}
        className="fill-paper-cream stroke-ink-sepia/60"
        strokeWidth={2}
      />
      <Reel cx={37} cy={45} animate={animate} />
      <Reel cx={63} cy={45} animate={animate} />
      <rect x={24} y={64} width={52} height={7} rx={2} className="fill-paper-cream/70" />
      <circle cx={30} cy={67.5} r={1.6} className="fill-ink-sepia" />
      <circle cx={70} cy={67.5} r={1.6} className="fill-ink-sepia" />
    </svg>
  );
}
