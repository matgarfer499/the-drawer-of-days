import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { vibrate } from "@shared/lib/haptics";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { AnimatePresence, motion, useAnimate, useMotionValue, useTransform } from "motion/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { type BoxPhase, nextPhase } from "./dragToOpen";
import { Ribbon } from "./Ribbon";

const seal = tv({
  slots: {
    wrap: "flex flex-col items-center gap-6",
    shell:
      "relative grid h-56 w-56 place-items-center rounded-2xl border-2 border-aged-tan/50 bg-kraft-tan/40 shadow-paper-lifted",
    inside:
      "pointer-events-none absolute inset-2 rounded-xl bg-radial from-golden-hour/45 to-transparent",
    lid: "absolute inset-0 grid touch-none place-items-center rounded-2xl border-2 border-aged-tan/50 bg-kraft-tan/70 shadow-paper-lifted",
    halo: "pointer-events-none absolute h-24 w-24 rounded-full bg-faded-rose/35 blur-md motion-safe:animate-breathe",
    knot: "relative z-10 grid h-16 w-16 touch-none cursor-grab select-none place-items-center rounded-full bg-rose-deep font-display text-sm text-paper-cream shadow-paper active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    arrow: "pointer-events-none absolute z-10 text-3xl text-rose-deep motion-safe:animate-bounce",
    label: "font-hand text-2xl text-ink-sepia",
    hint: "h-4 text-xs uppercase tracking-[0.2em] text-faded-ink",
    open: "min-h-11 rounded-full bg-faded-rose px-6 py-3 font-display text-base text-paper-cream shadow-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
  },
});

/**
 * The sealed tin. Opening it is a two-phase keepsake gesture: pull the bow's knot
 * sideways to untie it (the loops are drawn through the knot and the slack ribbon
 * slips off), then drag the lid up to lift it — and we dive into the open box with
 * a dolly zoom that hands over to the hub. The ribbon's tails sway with spring
 * physics as you pull. Keyboard and `prefers-reduced-motion` get a plain "abrir la
 * caja" button instead, opening straight to the hub. Copy comes from @content.
 */
export function SealedBox() {
  const openBox = useExperienceStore((state) => state.openBox);
  const reduced = useReducedMotion();
  const slots = seal();

  const [phase, setPhase] = useState<BoxPhase>("tied");
  const [scope, animate] = useAnimate();
  const pull = useMotionValue(0); // live horizontal drag of the knot
  const lift = useMotionValue(0); // live vertical drag of the lid
  const unravel = useMotionValue(0); // 0 = tied bow, 1 = fully undone
  const zoom = useMotionValue(1); // dolly-in scale of the whole box on opening
  const insideGlow = useTransform(zoom, [1, 4], [0.55, 1]); // the interior blooms as we dive in

  const tied = phase === "tied";
  const untied = phase === "untied";

  // untie: the loops are drawn through the knot as it comes undone, then the slack
  // ribbon slides off (handled by Ribbon's exit when the phase flips to "untied")
  const untie = async () => {
    setPhase("untying");
    vibrate([12, 24, 12]);
    animate(pull, 0, { duration: 0.25, ease: "easeOut" }); // knot eases back to centre
    await animate(unravel, 1, { duration: 0.55, ease: [0.4, 0, 0.6, 1] });
    setPhase("untied");
  };

  // open: the lid flies off and the box rushes toward us (dolly-in), then the hub
  const liftLid = async () => {
    setPhase("lifting");
    vibrate([10, 30, 10]);
    animate(lift, -400, { duration: 0.5, ease: [0.4, 0, 0.2, 1] });
    await animate(zoom, 9, { duration: 0.7, ease: [0.5, 0, 0.85, 0.4] });
    openBox();
  };

  return (
    <SceneFrame>
      <div className={slots.wrap()}>
        <motion.div ref={scope} className={slots.shell()} style={{ scale: zoom }}>
          <motion.span
            aria-hidden="true"
            className={slots.inside()}
            style={{ opacity: insideGlow }}
          />

          {reduced ? (
            <button type="button" className={slots.open()} onClick={openBox}>
              abrir la caja
            </button>
          ) : (
            <motion.div
              className={slots.lid()}
              style={{ y: lift }}
              drag={untied ? "y" : false}
              dragConstraints={{ top: -120, bottom: 0 }}
              dragElastic={0.3}
              dragSnapToOrigin
              onDragEnd={(_event, info) => {
                if (!untied) return;
                // up is negative y; feed it as positive distance/velocity
                if (
                  nextPhase("untied", { offset: -info.offset.y, velocity: -info.velocity.y }) ===
                  "lifting"
                ) {
                  void liftLid();
                }
              }}
            >
              <Ribbon pull={pull} untie={unravel} phase={phase} />

              <span className="relative grid place-items-center">
                <AnimatePresence>
                  {tied && (
                    <motion.span
                      key="halo"
                      aria-hidden="true"
                      className={slots.halo()}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>

                <motion.button
                  type="button"
                  className={slots.knot()}
                  style={{ x: pull }}
                  drag={tied ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  dragSnapToOrigin
                  whileDrag={{ scale: 1.08 }}
                  animate={tied ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                  // keyboard (and mouse-only users) open directly; the two-phase
                  // pull is a touch enhancement, not the only way in
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openBox();
                    }
                  }}
                  onDragEnd={(_event, info) => {
                    if (!tied) return;
                    if (
                      nextPhase("tied", { offset: info.offset.x, velocity: info.velocity.x }) ===
                      "untying"
                    ) {
                      void untie();
                    }
                  }}
                  aria-label={tied ? content.opening.ribbonHint : content.opening.lidHint}
                >
                  {tied ? "✿" : ""}
                </motion.button>

                <AnimatePresence>
                  {untied && (
                    <motion.span
                      key="arrow"
                      aria-hidden="true"
                      className={slots.arrow()}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ↑
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.div>
          )}
        </motion.div>

        <h1 className={slots.label()}>{content.opening.subGreetingLine}</h1>
        {!reduced && (
          <span className={slots.hint()}>
            {tied ? content.opening.ribbonHint : untied ? content.opening.lidHint : ""}
          </span>
        )}
      </div>
    </SceneFrame>
  );
}
