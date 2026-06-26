import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { seededTransformVars } from "@shared/lib/seededRotation";
import { Doodle } from "@shared/ui/Doodle";
import { Polaroid } from "@shared/ui/Polaroid";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { ThreadLine } from "@shared/ui/ThreadLine";
import { TornEdge } from "@shared/ui/TornEdge";
import { WashiTape } from "@shared/ui/WashiTape";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { SkyBackdrop } from "./components/SkyBackdrop";
import { Star } from "./components/Star";
import { constellationPoints, skyProgress } from "./constellations";

const { nodes, constellations, revealMessage } = content.sky;
const NODE_BY_ID = new Map(nodes.map((node) => [node.id, node]));

const ui = tv({
  slots: {
    root: "absolute inset-0 h-full w-full",
    header:
      "absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex flex-col items-center gap-0.5 text-center",
    title: "font-display type-title text-2xl text-silver-pen rotate-[var(--seed-rot)]",
    hint: "flex items-center gap-2 font-hand text-xl text-silver-pen/70",
    // above the revealed photo (detail, z-10) so every star stays visible and on top
    field: "absolute inset-0 z-20",
    reveal:
      "pointer-events-none absolute inset-x-0 top-[38%] z-10 px-8 text-center font-display type-tender text-2xl text-silver-pen leading-snug [text-shadow:0_0_16px_var(--color-golden-hour)]",
    // the revealed photo is a passive reveal sitting above the star field (z-[2]);
    // pointer-events-none lets taps fall through to every star — including the
    // lowest one ("casa") the photo would otherwise cover and intercept
    detail:
      "pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-2",
    detailWrap: "relative inline-block",
    detailTape: "-top-3 absolute left-1/2 z-10 -translate-x-1/2",
    detailLabel: "font-hand text-2xl text-ink-sepia",
    announce: "sr-only",
  },
});

/**
 * The paper sky: our places as cut-out stars on a night-paper spread — a paper
 * moon, drifting hand-cut clouds, torn hills, fold creases and a pencil frame.
 * Tapping a star lights it and emerges its photo; light every star of a
 * constellation and a silver thread sews it together and names it; light them
 * all and the hidden message is traced. Joining is forgiving — there's no wrong
 * move and nothing is required. Reduced motion rests the sky and the threads
 * render fully sewn. Keeps `spoke-sky` so it morphs from (and back to) its hub
 * keepsake.
 */
export function PaperSky() {
  const reduced = useReducedMotion() ?? false;
  const [lit, setLit] = useState<ReadonlySet<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);

  const toggle = (id: string) => {
    const wasLit = lit.has(id);
    setLit((prev) => {
      const next = new Set(prev);
      if (wasLit) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelected((prev) => (wasLit ? (prev === id ? null : prev) : id));
  };

  const progress = skyProgress(lit, constellations);
  const selectedNode = selected ? NODE_BY_ID.get(selected) : undefined;
  const s = ui();

  return (
    <SceneFrame tone="night" morphId="spoke-sky" flavor="nightfall">
      <div className={s.root()}>
        <SkyBackdrop />

        <header className={s.header()}>
          <h1
            className={s.title()}
            style={seededTransformVars("sky-title", {
              maxRotation: 2,
              maxOffset: 0,
              seed: content.seed,
            })}
          >
            {content.scenes.sky.title}
          </h1>
          <p className={s.hint()}>
            {content.scenes.sky.tagline}
            <Doodle id="sky-doodle" kind="asterisk" tone="silver" size="sm" />
          </p>
        </header>

        {/* completed constellations are sewn together with silver thread, stitch by stitch */}
        {progress.completed.map((constellation) => {
          const points = constellationPoints(constellation, NODE_BY_ID);
          return points.slice(1).map((point, i) => {
            const from = points[i];
            const segment = constellation.starIds[i];
            if (!from || !segment) return null;
            return (
              <ThreadLine
                key={`const-${constellation.id}-${segment}`}
                id={`const-${constellation.id}-${i}`}
                from={from}
                to={point}
                maxSag={2.5}
                tone="silver"
                draw={!reduced}
                drawDelay={0.1 + i * 0.18}
                className="z-[1]"
              />
            );
          });
        })}

        <div className={s.field()}>
          {nodes.map((node) => (
            <Star
              key={node.id}
              label={node.label}
              x={node.position.x}
              y={node.position.y}
              lit={lit.has(node.id)}
              reduced={reduced}
              onToggle={() => toggle(node.id)}
            />
          ))}
        </div>

        {/* persistent live regions: reliably announce the climax + the emerged place
            (a region inserted already-populated is announced inconsistently on iOS VO) */}
        <p role="status" className={s.reveal()}>
          {progress.allComplete ? revealMessage : ""}
        </p>
        <p role="status" className={s.announce()}>
          {selectedNode ? selectedNode.label : ""}
        </p>
        {/* the drawn threads are aria-hidden, so name each completed constellation here */}
        <p role="status" className={s.announce()}>
          {progress.completed.map((constellation) => constellation.name).join(", ")}
        </p>

        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key={selectedNode.id}
              className={s.detail()}
              initial={reduced ? false : { opacity: 0, y: 16, rotate: -5, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={
                reduced ? { duration: 0.2 } : { type: "spring", stiffness: 260, damping: 22 }
              }
            >
              {selectedNode.media ? (
                <span className={s.detailWrap()}>
                  <span className={s.detailTape()}>
                    <WashiTape id={`sky-tape-${selectedNode.id}`} tone="teal" length="sm" />
                  </span>
                  <Polaroid
                    id={selectedNode.id}
                    src={selectedNode.media.src}
                    alt={selectedNode.media.alt}
                    caption={selectedNode.label}
                    size="sm"
                  />
                </span>
              ) : (
                <TornEdge id={`sky-scrap-${selectedNode.id}`} tone="cream">
                  <span className={s.detailLabel()}>{selectedNode.label}</span>
                </TornEdge>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SceneFrame>
  );
}
