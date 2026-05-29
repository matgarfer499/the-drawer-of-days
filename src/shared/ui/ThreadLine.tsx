import { type Point, type StitchPathOptions, stitchPath } from "@shared/lib/stitchPath";
import { tv } from "tailwind-variants";

const threadLine = tv({
  slots: {
    svg: "pointer-events-none absolute inset-0 h-full w-full",
    path: "fill-none stroke-faded-rose stroke-2 [stroke-dasharray:5_7] [stroke-linecap:round]",
  },
});

interface ThreadLineProps {
  /** stable id — drives the deterministic sag of the stitch */
  id: string;
  from: Point;
  to: Point;
  /** viewBox dimensions; from/to are expressed in these units (default 100×100) */
  width?: number;
  height?: number;
  maxSag?: number;
  className?: string;
}

/**
 * The red thread that sews two opened hub objects together: a seeded stitch path
 * (see stitchPath) drawn as a dashed stroke. Decorative — it conveys progress
 * visually, so it stays out of the accessibility tree.
 */
export function ThreadLine({
  id,
  from,
  to,
  width = 100,
  height = 100,
  maxSag,
  className,
}: ThreadLineProps) {
  const { svg, path } = threadLine();
  const opts: StitchPathOptions = maxSag === undefined ? {} : { maxSag };
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={svg({ class: className })}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path className={path()} d={stitchPath(from, to, id, opts)} />
    </svg>
  );
}
