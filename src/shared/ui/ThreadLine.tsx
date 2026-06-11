import { type Point, type StitchPathOptions, stitchPath } from "@shared/lib/stitchPath";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";

const threadLine = tv({
  slots: {
    svg: "pointer-events-none absolute inset-0 h-full w-full",
    path: "fill-none stroke-2 [stroke-dasharray:5_7] [stroke-linecap:round]",
  },
  variants: {
    tone: {
      rose: { path: "stroke-faded-rose" },
      silver: { path: "stroke-silver-pen/80" },
      golden: { path: "stroke-golden-hour/70" },
    },
  },
  defaultVariants: { tone: "rose" },
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
  /** animate the stitch being sewn (a mask sweeps along the path); default static */
  draw?: boolean;
  /** delay (s) before the draw sweep starts */
  drawDelay?: number;
  /** thread colour: the red of the hub, silver for the night sky, gold for the finale */
  tone?: "rose" | "silver" | "golden";
  className?: string;
}

/**
 * The red thread that sews two opened hub objects together: a seeded stitch path
 * (see stitchPath) drawn as a dashed stroke. Decorative — it conveys progress
 * visually, so it stays out of the accessibility tree.
 *
 * With `draw`, the thread sews itself on: a fat white stroke sweeps along the
 * same path inside a mask and reveals the stitch. (Animating `pathLength` on the
 * visible path would overwrite its dash pattern — the mask keeps the stitches.)
 */
export function ThreadLine({
  id,
  from,
  to,
  width = 100,
  height = 100,
  maxSag,
  draw = false,
  drawDelay = 0.35,
  tone = "rose",
  className,
}: ThreadLineProps) {
  const { svg, path } = threadLine({ tone });
  const opts: StitchPathOptions = maxSag === undefined ? {} : { maxSag };
  const d = stitchPath(from, to, id, opts);
  const maskId = `thread-draw-${id}`;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={svg({ class: className })}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {draw && (
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={-10}
          y={-10}
          width={width + 20}
          height={height + 20}
        >
          {/* white = mask alpha, not a visual colour; delayed so the morph-back lands first */}
          <motion.path
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={10}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: drawDelay }}
          />
        </mask>
      )}
      {/* non-scaling-stroke: the viewBox stretches (preserveAspectRatio=none) but the
          2px thread and its round stitch-dashes must stay uniform, not flatten to ovals */}
      <path
        className={path()}
        d={d}
        vectorEffect="non-scaling-stroke"
        mask={draw ? `url(#${maskId})` : undefined}
      />
    </svg>
  );
}
