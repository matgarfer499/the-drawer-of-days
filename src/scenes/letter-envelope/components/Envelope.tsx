import { useReducedMotion } from "@features/reduced-motion";
import { cn } from "@shared/lib/cn";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";

const envelope = tv({
  slots: {
    svg: "h-14 w-24 drop-shadow-sticker",
    body: "fill-kraft-tan stroke-aged-tan/60",
    crease: "fill-none stroke-aged-tan/50",
    flap: "fill-aged-tan/85",
    seal: "fill-faded-rose",
    sealRing: "fill-none stroke-rose-deep/50",
  },
});

interface EnvelopeProps {
  /** breathe while reasons remain (rests once it's been opened or under reduced motion) */
  idle?: boolean;
  /** bump per pull — the flap springs open again for each reason drawn out */
  pullKey?: number;
}

/**
 * A small kraft envelope with a wax seal — the keepsake the reasons are pulled
 * from. The flap breathes until the first pull; after that it springs open for
 * each reason drawn out (a foreshortened fold, not a 3D rotate, so it works on
 * SVG everywhere). Decorative — the pull button around it carries the
 * accessible name.
 */
export function Envelope({ idle = false, pullKey }: EnvelopeProps) {
  const reduced = useReducedMotion() ?? false;
  const s = envelope();
  const replay = (pullKey ?? 0) > 0 && !reduced;

  return (
    <svg viewBox="0 0 96 64" aria-hidden="true" className={s.svg()}>
      <rect x="3" y="14" width="90" height="46" rx="3" className={s.body()} strokeWidth="1.5" />
      {/* back-fold creases */}
      <path d="M4 59 L40 38 M92 59 L56 38" className={s.crease()} strokeWidth="1" />
      {/* flap + seal fold open together on each pull */}
      <motion.g
        key={pullKey ?? 0}
        className="origin-top [transform-box:fill-box]"
        {...(replay
          ? {
              initial: { scaleY: 1 },
              animate: { scaleY: [1, 0.25, 0.25, 1] },
              transition: { duration: 0.8, times: [0, 0.3, 0.6, 1], ease: "easeOut" },
            }
          : {})}
      >
        <path
          d="M4 16 L48 44 L92 16 Z"
          className={cn(
            s.flap(),
            "origin-top [transform-box:fill-box]",
            idle && !replay && "motion-safe:animate-flap-breathe",
          )}
        />
        {/* the wax seal — an irregular blob, never a perfect circle */}
        <g
          className={cn(
            "origin-center [transform-box:fill-box]",
            idle && "motion-safe:animate-seal-pulse",
          )}
        >
          <path
            d="M42 40 q -1 -5 4 -6 q 6 -1 7 4 q 1 5 -4 6.5 q -6 1 -7 -4.5 Z"
            className={s.seal()}
          />
          <circle cx="47.5" cy="40.5" r="3" className={s.sealRing()} strokeWidth="1" />
        </g>
      </motion.g>
    </svg>
  );
}
