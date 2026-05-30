import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { Polaroid } from "@shared/ui/Polaroid";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { Star } from "./components/Star";
import { constellationPoints, skyProgress } from "./constellations";

const { nodes, constellations, revealMessage } = content.sky;
const NODE_BY_ID = new Map(nodes.map((node) => [node.id, node]));

const ui = tv({
  slots: {
    root: "absolute inset-0 h-full w-full",
    header:
      "absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex flex-col items-center gap-0.5 text-center",
    title: "font-display text-2xl text-silver-pen",
    hint: "font-hand text-xl text-silver-pen/70",
    lines: "pointer-events-none absolute inset-0 h-full w-full",
    field: "absolute inset-0",
    reveal:
      "absolute inset-x-0 top-[38%] z-10 px-8 text-center font-display text-2xl text-silver-pen leading-snug [text-shadow:0_0_16px_var(--color-golden-hour)]",
    detail:
      "absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-2",
    detailLabel: "font-hand text-2xl text-silver-pen",
  },
});

/**
 * The paper sky: our places as cut-out stars on a night-paper ground. Tapping a
 * star lights it and emerges its photo; light every star of a constellation and
 * its line is drawn and named; light them all and the hidden message is traced.
 * Joining is forgiving — there's no wrong move and nothing is required. Reduced
 * motion drops the twinkle and draws the lines/message at rest. Keeps
 * `spoke-sky` so it morphs from (and back to) its hub keepsake.
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
    <SceneFrame tone="night" morphId="spoke-sky">
      <div className={s.root()}>
        <header className={s.header()}>
          <h2 className={s.title()}>El cielo de papel</h2>
          <p className={s.hint()}>toca las estrellas de nuestros lugares</p>
        </header>

        {/* constellation lines, drawn once all their stars are lit */}
        <svg
          className={s.lines()}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {progress.completed.map((constellation) => {
            const points = constellationPoints(constellation, NODE_BY_ID)
              .map((p) => `${p.x},${p.y}`)
              .join(" ");
            return (
              <motion.polyline
                key={constellation.id}
                points={points}
                className="fill-none stroke-silver-pen/70"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                initial={reduced ? false : { pathLength: 0 }}
                animate={reduced ? false : { pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            );
          })}
        </svg>

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

        {progress.allComplete ? (
          <p role="status" className={s.reveal()}>
            {revealMessage}
          </p>
        ) : null}

        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key={selectedNode.id}
              className={s.detail()}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {selectedNode.media ? (
                <Polaroid
                  id={selectedNode.id}
                  src={selectedNode.media.src}
                  alt={selectedNode.media.alt}
                  caption={selectedNode.label}
                  size="sm"
                />
              ) : (
                <span className={s.detailLabel()}>{selectedNode.label}</span>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SceneFrame>
  );
}
