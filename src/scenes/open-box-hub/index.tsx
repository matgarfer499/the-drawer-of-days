import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { vibrate } from "@shared/lib/haptics";
import { seededTransformVars } from "@shared/lib/seededRotation";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { StampPin } from "@shared/ui/StampPin";
import { ThreadLine } from "@shared/ui/ThreadLine";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { tv } from "tailwind-variants";
import { hubLayout, hubPositionVars } from "./hubLayout";
import { KEEPSAKE_ICONS } from "./keepsakes";

const layout = tv({
  slots: {
    stage: "relative mx-auto h-full w-full max-w-md",
    title:
      "absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] text-center font-hand text-2xl text-faded-rose",
    nav: "absolute inset-0",
    controls:
      "absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-2",
    secret:
      "inline-flex min-h-11 items-center rounded-full bg-golden-hour/40 px-5 font-hand text-xl text-rose-deep shadow-paper transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    tour: "inline-flex min-h-11 items-center px-4 text-xs uppercase tracking-[0.2em] text-faded-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
  },
});

// The keepsakes sit hand-placed on the open box: no card, no shadow — just the
// animated icon and its label, each tilted/nudged by a seed so the collage looks
// laid out by hand. The seed vars live on the button; the icon and label inherit
// them. The morph frame itself stays upright so the shared-layout morph is clean.
const keepsake = tv({
  slots: {
    button:
      "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl p-1 left-[var(--hub-x)] top-[var(--hub-y)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-deep",
    frame: "relative block",
    iconTilt:
      "block rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)]",
    icon: "h-24 w-24",
    label:
      "max-w-24 rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] text-center font-hand text-lg leading-tight text-ink-sepia",
    stamp: "absolute -top-2 -right-2 h-9 w-9 text-sm",
  },
});

/**
 * The open box: a collage of keepsake objects laid out by hubLayout, the red
 * thread sewing together the ones already opened, the finale gate (once every
 * core scene is seen) and the "show me everything" tour. The objects live in a
 * real <nav> so the whole thing is keyboard- and screen-reader navigable.
 */
export function Hub() {
  const enterScene = useExperienceStore((state) => state.enterScene);
  const enterFinale = useExperienceStore((state) => state.enterFinale);
  const startTour = useExperienceStore((state) => state.startTour);
  const visited = useExperienceStore((state) => state.visitedScenes);
  const finaleUnlocked = useExperienceStore((state) => state.finaleUnlocked);
  const previousScene = useExperienceStore((state) => state.previousScene);
  const reduced = useReducedMotion();

  const objects = content.hubObjects;
  const keepsakeRefs = useRef(new Map<string, HTMLButtonElement | null>());

  // On returning to the hub, put focus back on the keepsake just closed (or the
  // first one when the box first opens) so keyboard/AT users aren't dropped to <body>.
  useEffect(() => {
    const refs = keepsakeRefs.current;
    const fromPrevious = previousScene ? refs.get(previousScene) : undefined;
    const first = objects[0] ? refs.get(objects[0].scene) : undefined;
    (fromPrevious ?? first)?.focus();
  }, [previousScene]);

  const points = hubLayout(objects.length, content.seed);
  const pointFor = new Map(objects.map((object, i) => [object.scene, points[i]]));
  const visitedOrder = [...visited];

  const { stage, title, nav, controls, secret, tour } = layout();

  return (
    <SceneFrame>
      <div className={stage()}>
        <h1 className={title()}>El cajón de los días</h1>

        {/* the red thread sews opened keepsakes together, in the order they were seen */}
        {visitedOrder.slice(1).map((scene, i) => {
          const from = pointFor.get(visitedOrder[i] ?? scene);
          const to = pointFor.get(scene);
          if (!from || !to) return null;
          return <ThreadLine key={`thread-${scene}`} id={`thread-${scene}`} from={from} to={to} />;
        })}

        <nav className={nav()} aria-label="Los recuerdos de la caja">
          {objects.map((object, i) => {
            const point = points[i];
            if (!point) return null;
            const isVisited = visited.has(object.scene);
            const slots = keepsake();
            const Icon = KEEPSAKE_ICONS[object.scene];
            return (
              <motion.button
                key={object.id}
                ref={(el) => {
                  keepsakeRefs.current.set(object.scene, el);
                }}
                type="button"
                className={slots.button()}
                style={{
                  ...hubPositionVars(point),
                  ...seededTransformVars(object.id, {
                    maxRotation: 6,
                    maxOffset: 4,
                    seed: content.seed,
                  }),
                }}
                onClick={() => {
                  vibrate(8);
                  enterScene(object.scene);
                }}
                whileHover={reduced ? {} : { scale: 1.06 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
              >
                <motion.span
                  className={slots.frame()}
                  {...(reduced ? {} : { layoutId: `spoke-${object.scene}` })}
                >
                  <span className={slots.iconTilt()}>
                    <Icon animate={!isVisited} className={slots.icon()} />
                  </span>
                  {isVisited && (
                    <StampPin
                      id={`seen-${object.id}`}
                      tone="rose"
                      label="Visto"
                      className={slots.stamp()}
                    >
                      ✓
                    </StampPin>
                  )}
                </motion.span>
                <span className={slots.label()}>{object.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className={controls()}>
          {finaleUnlocked && (
            <button
              type="button"
              className={secret()}
              onClick={() => {
                vibrate([20, 40, 20, 40, 60]); // a little fanfare for the secret
                enterFinale();
              }}
            >
              abrir el doble fondo
            </button>
          )}
          <button type="button" className={tour()} onClick={startTour}>
            enséñamelo todo
          </button>
        </div>
      </div>
    </SceneFrame>
  );
}
