import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { vibrate } from "@shared/lib/haptics";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";
import { shouldOpenFromDrag } from "./dragToOpen";

const seal = tv({
  slots: {
    wrap: "flex flex-col items-center gap-6",
    box: "relative grid h-56 w-56 place-items-center rounded-2xl border-2 border-aged-tan/50 bg-kraft-tan/50 shadow-paper-lifted",
    bandV: "pointer-events-none absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-faded-rose/55",
    bandH: "pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-faded-rose/55",
    halo: "pointer-events-none absolute h-24 w-24 rounded-full bg-faded-rose/40 blur-md motion-safe:animate-breathe",
    knot: "relative z-10 touch-none cursor-grab select-none rounded-full bg-faded-rose px-6 py-3 font-display text-base text-paper-cream shadow-paper active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    label: "font-hand text-2xl text-ink-sepia",
    hint: "text-xs uppercase tracking-[0.2em] text-faded-ink",
  },
});

/**
 * The sealed tin: a kraft box tied with a ribbon whose bow "breathes" to invite a
 * pull. Drag the bow (any direction) past a threshold — or just tap it — to untie
 * and open. Breathing is motion-safe CSS, so it rests under prefers-reduced-motion;
 * the tap always works.
 */
export function SealedBox() {
  const openBox = useExperienceStore((state) => state.openBox);
  const reduced = useReducedMotion();
  const { wrap, box, bandV, bandH, halo, knot, label, hint } = seal();
  const open = () => {
    vibrate([12, 24, 12]); // the little "untie" flutter
    openBox();
  };
  return (
    <SceneFrame>
      <div className={wrap()}>
        <div className={box()}>
          <span aria-hidden="true" className={bandV()} />
          <span aria-hidden="true" className={bandH()} />
          <span className="relative grid place-items-center">
            <span aria-hidden="true" className={halo()} />
            <motion.button
              type="button"
              className={knot()}
              onClick={open}
              drag
              dragSnapToOrigin
              dragElastic={0.5}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              whileDrag={reduced ? {} : { scale: 1.08 }}
              onDragEnd={(_event, info) => {
                // radial magnitude so a pull in ANY direction counts (the bow drags freely)
                const offset = Math.hypot(info.offset.x, info.offset.y);
                const velocity = Math.hypot(info.velocity.x, info.velocity.y);
                if (shouldOpenFromDrag({ offset, velocity })) open();
              }}
            >
              tira del lazo
            </motion.button>
          </span>
        </div>
        <span className={label()}>{content.opening.subGreetingLine}</span>
        <span className={hint()}>o tócalo</span>
      </div>
    </SceneFrame>
  );
}
