import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { vibrate } from "@shared/lib/haptics";
import { seededTransformVars } from "@shared/lib/seededRotation";
import { Doodle } from "@shared/ui/Doodle";
import { GrainOverlay } from "@shared/ui/GrainOverlay";
import { PhotoCorner } from "@shared/ui/PhotoCorner";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { StampPin } from "@shared/ui/StampPin";
import { ThreadLine } from "@shared/ui/ThreadLine";
import { WashiTape } from "@shared/ui/WashiTape";
import { motion, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { tv } from "tailwind-variants";
import { hubEntryDelay, hubLayout, hubPositionVars } from "./hubLayout";
import { KEEPSAKE_ICONS } from "./keepsakes";

const layout = tv({
  slots: {
    stage: "relative mx-auto h-full w-full max-w-md",
    // the inside of the tin: a kraft floor that darkens toward the lip, sunk by a warm inset shade
    interior:
      "pointer-events-none absolute inset-x-3 top-[9%] bottom-[5%] rounded-[1.75rem] bg-gradient-to-b from-kraft-tan/50 via-kraft-tan/30 to-aged-tan/45 shadow-paper-inset",
    interiorLip:
      "pointer-events-none absolute inset-x-3 top-[9%] bottom-[5%] rounded-[1.75rem] border-2 border-aged-tan/40",
    title:
      "absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] text-center font-display type-poster text-3xl text-ink-sepia rotate-[var(--seed-rot)]",
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

// Each keepsake drops into the box and settles with one soft spring overshoot;
// the per-item delay cascades down the zigzag (see hubEntryDelay).
const keepsakeVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.9 },
  shown: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, type: "spring", stiffness: 340, damping: 24, mass: 0.9 },
  }),
};

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
  const newestVisited = visitedOrder.at(-1);

  // The settling choreography plays only the first time the box opens; coming
  // back from a scene must leave the layoutId morph-back uncontested.
  const reveal = !reduced && previousScene === null;

  const { stage, interior, interiorLip, title, nav, controls, secret, tour } = layout();

  return (
    <SceneFrame>
      <div className={stage()}>
        <div className={interior()} aria-hidden="true">
          <GrainOverlay />
          <WashiTape
            id="hub-washi-a"
            tone="sage"
            length="sm"
            className="absolute top-[6%] left-[5%]"
          />
          <WashiTape
            id="hub-washi-b"
            tone="rose"
            length="sm"
            className="absolute right-[5%] bottom-[3%]"
          />
          {/* pencil marks and photo mounts — the tin's floor has been lived on */}
          <Doodle
            id="hub-doodle-heart"
            kind="heart"
            tone="rose"
            size="sm"
            className="absolute top-[10%] right-[12%]"
          />
          <Doodle
            id="hub-doodle-ast"
            kind="asterisk"
            tone="ink"
            size="sm"
            className="absolute bottom-[12%] left-[10%]"
          />
          <PhotoCorner corner="tl" tone="cream" className="top-2 left-2" />
          <PhotoCorner corner="br" tone="cream" className="right-2 bottom-2" />
        </div>
        <div className={interiorLip()} aria-hidden="true" />

        <motion.h1
          className={title()}
          style={seededTransformVars("hub-title", {
            maxRotation: 3.2,
            maxOffset: 0,
            seed: content.seed,
          })}
          initial={reveal ? { opacity: 0, y: -8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          El cajón de los días
        </motion.h1>

        {/* the red thread sews opened keepsakes together, in the order they were seen */}
        {visitedOrder.slice(1).map((scene, i) => {
          const from = pointFor.get(visitedOrder[i] ?? scene);
          const to = pointFor.get(scene);
          if (!from || !to) return null;
          return (
            <ThreadLine
              key={`thread-${scene}`}
              id={`thread-${scene}`}
              from={from}
              to={to}
              draw={!reduced && scene === previousScene && scene === newestVisited}
            />
          );
        })}

        <motion.nav
          className={nav()}
          aria-label="Los recuerdos de la caja"
          initial={reveal ? "hidden" : false}
          animate="shown"
        >
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
                variants={keepsakeVariants}
                custom={hubEntryDelay(object.id, i, content.seed)}
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
        </motion.nav>

        <motion.div
          className={controls()}
          initial={reveal ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reveal ? 0.55 : 0, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>
      </div>
    </SceneFrame>
  );
}
