import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { seededTransformVars } from "@shared/lib/seededRotation";
import { Doodle } from "@shared/ui/Doodle";
import { PaperFrame } from "@shared/ui/PaperFrame";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { StampPin } from "@shared/ui/StampPin";
import { TornEdge } from "@shared/ui/TornEdge";
import { WashiTape } from "@shared/ui/WashiTape";
import { motion } from "motion/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { Envelope } from "./components/Envelope";
import { composeLetter } from "./letter";

const ui = tv({
  slots: {
    root: "flex h-full w-full max-w-md flex-col items-center gap-3 py-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]",
    title: "font-display type-title text-3xl text-ink-sepia",
    subtitle: "-mt-1 font-hand text-2xl text-faded-rose",
    // the page tilts a hair off true and pins its garnish outside the scroll
    sheetWrap: "-rotate-[0.8deg] relative w-full min-h-0 flex-1",
    sheet: "h-full w-full overflow-y-auto bg-ruled",
    crease:
      "pointer-events-none absolute inset-x-2 top-1/3 h-px bg-ink-sepia/10 shadow-[0_1px_0_var(--color-paper-cream)]",
    cornerTape: "-top-2 -left-3 absolute -rotate-45",
    cornerStamp: "absolute top-2 right-2 h-10 w-10 text-lg",
    marginDoodle: "absolute right-5 bottom-2",
    list: "flex flex-col items-stretch gap-5",
    scrapWrap: "relative inline-block",
    scrapTape: "-top-2.5 absolute left-1/2 z-10 -translate-x-1/2",
    reason: "block max-w-[26ch] font-hand text-2xl leading-snug text-ink-sepia",
    pending:
      "mx-auto max-w-[85%] rounded-sm border border-aged-tan/50 border-dashed bg-paper-cream/40 px-3 py-1.5 text-center font-hand text-faded-ink/70 text-lg rotate-[var(--seed-rot)]",
    controls: "flex flex-col items-center gap-1",
    pullBtn:
      "flex min-h-11 items-center gap-3 rounded-full bg-paper-cream px-4 py-2 shadow-paper transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-rose-deep focus-visible:outline-offset-2",
    pullLabel: "font-hand text-xl text-rose-deep",
    hint: "min-h-6 text-faded-ink text-xs uppercase tracking-[0.2em]",
  },
  variants: {
    // the envelope is empty: dim it but keep it focusable (aria-disabled, not disabled)
    spent: {
      true: { pullBtn: "cursor-default opacity-50 hover:scale-100" },
      false: {},
    },
    // dealt scraps zigzag down the page, never centred
    flip: {
      true: { scrapWrap: "self-end mr-1" },
      false: { scrapWrap: "self-start ml-1" },
    },
  },
  defaultVariants: { spent: false, flip: false },
});

const TAPES = ["rose", "sage", "golden"] as const;

const sceneLabel = (scene: string): string =>
  content.hubObjects.find((object) => object.scene === scene)?.label ?? scene;

/** A reason drawn from the envelope onto the letter — dealt like a card and taped down. */
function RevealedReason({
  id,
  text,
  index,
  reduced,
}: {
  id: string;
  text: string;
  index: number;
  reduced: boolean;
}) {
  const s = ui({ flip: index % 2 === 1 });
  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: -18, rotate: index % 2 ? 7 : -6, scale: 1.05 },
        animate: { opacity: 1, y: 0, rotate: 0, scale: 1 },
        transition: { type: "spring" as const, stiffness: 260, damping: 22, mass: 0.9 },
      };
  return (
    <motion.li className={s.scrapWrap()} {...motionProps}>
      <span className={s.scrapTape()}>
        <WashiTape id={`tape-${id}`} tone={TAPES[index % 3]} length="sm" />
      </span>
      <TornEdge id={id} tone={index % 2 ? "kraft" : "cream"}>
        <span className={s.reason()}>{text}</span>
      </TornEdge>
    </motion.li>
  );
}

/**
 * The envelope of reasons. They're pulled out one at a time and dealt onto a
 * ruled letter page that scrolls inside its paper frame (the page never
 * scrolls): each reason a torn scrap taped down askew, zigzagging down the
 * sheet. The letter also writes itself: a reason tagged `unlockedBy` stays a
 * penciled-in placeholder until that scene has been seen, then becomes pullable
 * — so exploring the box fills the letter in. Reduced motion drops the dealing;
 * the pull ritual stays. Keeps `spoke-letter` so it morphs from (and back to)
 * its hub keepsake.
 */
export function LetterEnvelope() {
  const reduced = useReducedMotion() ?? false;
  const unlockedReasons = useExperienceStore((state) => state.unlockedReasons);
  const [pulled, setPulled] = useState(0);

  const view = composeLetter(content.reasons, unlockedReasons, pulled);
  const s = ui({ spent: view.remaining === 0 });

  let revealedIndex = -1;

  return (
    <SceneFrame morphId="spoke-letter" flavor="unfold">
      <div className={s.root()}>
        <h1 className={s.title()}>{content.scenes.letter.title}</h1>
        <p className={s.subtitle()}>{content.scenes.letter.tagline}</p>

        <div className={s.sheetWrap()}>
          <PaperFrame tone="cream" elevation="lifted" padding="md" className={s.sheet()}>
            <ul className={s.list()} aria-live="polite" aria-relevant="additions">
              {view.slots.map((slot) => {
                if (slot.status === "in-envelope") return null;
                if (slot.status === "pending") {
                  return (
                    <li
                      key={slot.reason.id}
                      className={s.pending()}
                      style={seededTransformVars(`pending-${slot.reason.id}`, {
                        maxRotation: 1.5,
                        maxOffset: 2,
                      })}
                    >
                      <span>por escribir — abre «{sceneLabel(slot.reason.unlockedBy ?? "")}»</span>
                    </li>
                  );
                }
                revealedIndex += 1;
                return (
                  <RevealedReason
                    key={slot.reason.id}
                    id={slot.reason.id}
                    text={slot.reason.text}
                    index={revealedIndex}
                    reduced={reduced}
                  />
                );
              })}
            </ul>
          </PaperFrame>

          {/* garnish pinned to the page, outside the scroll */}
          <span aria-hidden="true" className={s.crease()} />
          <span aria-hidden="true" className={s.cornerTape()}>
            <WashiTape id="letter-tape-tl" tone="rose" length="sm" />
          </span>
          <StampPin id="letter-stamp" tone="rose" className={s.cornerStamp()}>
            ♥
          </StampPin>
          <Doodle
            id="letter-doodle"
            kind="wave"
            tone="rose"
            size="sm"
            className={s.marginDoodle()}
          />
        </div>

        <div className={s.controls()}>
          <button
            type="button"
            className={s.pullBtn()}
            onClick={() => {
              if (view.remaining === 0) return;
              setPulled((p) => Math.min(p + 1, view.availableCount));
            }}
            aria-disabled={view.remaining === 0}
            aria-label={
              view.remaining > 0 ? "Saca otra razón del sobre" : "Ya no quedan razones por sacar"
            }
          >
            <Envelope idle={view.remaining > 0 && !reduced} pullKey={pulled} />
            <span aria-hidden="true" className={s.pullLabel()}>
              {view.remaining > 0 ? "saca otra razón" : "ya está"}
            </span>
          </button>
          {/* a persistent polite live region: announces the end state when it appears */}
          <p role="status" className={s.hint()}>
            {view.remaining > 0
              ? ""
              : view.pendingCount > 0
                ? "la carta crecerá según explores"
                : "ya están todas"}
          </p>
        </div>
      </div>
    </SceneFrame>
  );
}
