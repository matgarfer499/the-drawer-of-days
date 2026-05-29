import { SceneFrame } from "@shared/ui/SceneFrame";

/** Placeholder for the playful paper sky — built in phase 7 (2D), R3F in the finale. */
export function PaperSky() {
  return (
    <SceneFrame>
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-display text-4xl text-ink-sepia">El cielo de papel</h2>
        <p className="font-hand text-2xl text-faded-rose">nuestros lugares</p>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-faded-ink">
          placeholder · fase 7
        </p>
      </div>
    </SceneFrame>
  );
}
