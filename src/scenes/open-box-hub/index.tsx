import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { StampPin } from "@shared/ui/StampPin";
import { ThreadLine } from "@shared/ui/ThreadLine";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { tv } from "tailwind-variants";
import { hubLayout, hubPositionVars } from "./hubLayout";

const layout = tv({
  slots: {
    stage: "relative mx-auto h-full w-full max-w-md",
    title: "absolute inset-x-0 top-[3%] text-center font-hand text-2xl text-faded-rose",
    nav: "absolute inset-0",
    controls: "absolute inset-x-0 bottom-[3%] flex flex-col items-center gap-2",
    secret:
      "rounded-full bg-golden-hour/40 px-5 py-2 font-hand text-xl text-rose-deep shadow-paper transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    tour: "text-xs uppercase tracking-[0.2em] text-faded-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
  },
});

const keepsake = tv({
  slots: {
    button:
      "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl p-1 left-[var(--hub-x)] top-[var(--hub-y)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-deep",
    frame: "relative block rounded-md bg-paper-cream p-1.5 shadow-paper",
    art: "h-20 w-20 object-contain",
    label: "max-w-24 text-center font-hand text-lg leading-tight text-ink-sepia",
    stamp: "absolute -top-3 -right-3 h-9 w-9 text-sm",
  },
  variants: {
    veiled: { true: { button: "opacity-45 grayscale" }, false: {} },
  },
  defaultVariants: { veiled: false },
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
            const slots = keepsake({ veiled: !isVisited });
            return (
              <motion.button
                key={object.id}
                ref={(el) => {
                  keepsakeRefs.current.set(object.scene, el);
                }}
                type="button"
                className={slots.button()}
                style={hubPositionVars(point)}
                onClick={() => enterScene(object.scene)}
                whileHover={reduced ? {} : { scale: 1.06 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
              >
                <motion.span
                  className={slots.frame()}
                  {...(reduced ? {} : { layoutId: `spoke-${object.scene}` })}
                >
                  <img
                    className={slots.art()}
                    src={object.art.src}
                    alt=""
                    width={object.art.width}
                    height={object.art.height}
                    loading="lazy"
                    decoding="async"
                  />
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
            <button type="button" className={secret()} onClick={enterFinale}>
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
