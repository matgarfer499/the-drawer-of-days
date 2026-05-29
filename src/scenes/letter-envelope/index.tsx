import { SceneFrame } from "@shared/ui/SceneFrame";

/** Placeholder for the envelope of reasons — built in phase 6. */
export function LetterEnvelope() {
  return (
    <SceneFrame>
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-display text-4xl text-ink-sepia">El sobre</h2>
        <p className="font-hand text-2xl text-faded-rose">razones por las que te quiero</p>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-faded-ink">
          placeholder · fase 6
        </p>
      </div>
    </SceneFrame>
  );
}
