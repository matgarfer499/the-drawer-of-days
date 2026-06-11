import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { useExperienceStore } from "@features/scene-engine";
import { PaperFrame } from "@shared/ui/PaperFrame";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { motion } from "motion/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { Envelope } from "./components/Envelope";
import { composeLetter } from "./letter";

const ui = tv({
  slots: {
    root: "flex h-full w-full max-w-md flex-col items-center gap-3 py-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]",
    title: "font-display text-3xl text-ink-sepia",
    subtitle: "-mt-1 font-hand text-2xl text-faded-rose",
    sheet: "w-full min-h-0 flex-1 overflow-y-auto",
    list: "flex flex-col gap-4",
    reason: "font-hand text-2xl leading-snug text-ink-sepia",
    pending: "flex items-center gap-2 font-body text-sm text-faded-ink italic",
    pendingLine: "h-px flex-1 border-aged-tan/60 border-t border-dashed",
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
  },
  defaultVariants: { spent: false },
});

const sceneLabel = (scene: string): string =>
  content.hubObjects.find((object) => object.scene === scene)?.label ?? scene;

/** A reason drawn from the envelope onto the letter — written in by hand. */
function RevealedReason({
  text,
  reduced,
  className,
}: {
  text: string;
  reduced: boolean;
  className: string;
}) {
  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };
  return (
    <motion.li className={className} {...motionProps}>
      {text}
    </motion.li>
  );
}

/**
 * The envelope of reasons. They're pulled out one at a time onto a letter that
 * scrolls inside its paper frame (the page never scrolls). The letter also writes
 * itself: a reason tagged `unlockedBy` stays a pending placeholder until that scene
 * has been seen, then becomes pullable — so exploring the box fills the letter in.
 * Reduced motion drops the hand-writing slide; the pull ritual stays. Keeps
 * `spoke-letter` so it morphs from (and back to) its hub keepsake.
 */
export function LetterEnvelope() {
  const reduced = useReducedMotion() ?? false;
  const unlockedReasons = useExperienceStore((state) => state.unlockedReasons);
  const [pulled, setPulled] = useState(0);

  const view = composeLetter(content.reasons, unlockedReasons, pulled);
  const s = ui({ spent: view.remaining === 0 });

  return (
    <SceneFrame morphId="spoke-letter" flavor="unfold">
      <div className={s.root()}>
        <h1 className={s.title()}>{content.scenes.letter.title}</h1>
        <p className={s.subtitle()}>{content.scenes.letter.tagline}</p>

        <PaperFrame tone="cream" elevation="lifted" padding="lg" className={s.sheet()}>
          <ul className={s.list()} aria-live="polite" aria-relevant="additions">
            {view.slots.map((slot) => {
              if (slot.status === "in-envelope") return null;
              if (slot.status === "pending") {
                return (
                  <li key={slot.reason.id} className={s.pending()}>
                    <span aria-hidden="true" className={s.pendingLine()} />
                    <span>por escribir — abre «{sceneLabel(slot.reason.unlockedBy ?? "")}»</span>
                    <span aria-hidden="true" className={s.pendingLine()} />
                  </li>
                );
              }
              return (
                <RevealedReason
                  key={slot.reason.id}
                  text={slot.reason.text}
                  reduced={reduced}
                  className={s.reason()}
                />
              );
            })}
          </ul>
        </PaperFrame>

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
            <Envelope />
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
