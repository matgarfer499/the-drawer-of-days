import type { AssetRef } from "@content";
import { Polaroid } from "@shared/ui/Polaroid";
import { WashiTape } from "@shared/ui/WashiTape";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";

const ascending = tv({
  slots: {
    anchor:
      "absolute -translate-x-1/2 -translate-y-1/2 rotate-[var(--ap-rot)] left-[var(--ap-x)] top-[var(--ap-y)]",
    lift: "relative",
    tape: "-top-2 absolute left-1/2 z-10 -translate-x-1/2",
  },
});

interface AscendingPhotoProps {
  id: string;
  photo: AssetRef;
  /** resting position + tilt, viewport % / degrees */
  x: number;
  y: number;
  rotate: number;
  /** lift-off delay in seconds */
  delay: number;
  reduced: boolean;
}

/**
 * One polaroid that lifts into the sky and settles. A static outer anchor places
 * and tilts it (CSS vars — the sanctioned exception); the inner motion element
 * does the rise, so its transform never fights the anchor's. Reduced motion drops
 * the rise and leaves it at rest.
 */
export function AscendingPhoto({ id, photo, x, y, rotate, delay, reduced }: AscendingPhotoProps) {
  const { anchor, lift, tape } = ascending();
  const vars: Record<`--${string}`, string> = {
    "--ap-x": `${x}%`,
    "--ap-y": `${y}%`,
    "--ap-rot": `${rotate.toFixed(2)}deg`,
  };
  return (
    <span className={anchor()} style={vars}>
      <motion.div
        className={lift()}
        initial={reduced ? false : { opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : delay, duration: 0.9, ease: "easeOut" }}
      >
        {/* a strip of golden tape pins each memory into the night */}
        <span aria-hidden="true" className={tape()}>
          <WashiTape id={`${id}-tape`} tone="golden" length="sm" />
        </span>
        <Polaroid id={id} src={photo.src} alt={photo.alt} size="sm" />
      </motion.div>
    </span>
  );
}
