import { SceneFrame } from "@shared/ui/SceneFrame";

/** Placeholder for the cassette timeline — built in phase 5. */
export function CassetteTimeline() {
  return (
    <SceneFrame>
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-display text-4xl text-ink-sepia">La cinta</h2>
        <p className="font-hand text-2xl text-faded-rose">nuestra historia</p>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-faded-ink">
          placeholder · fase 5
        </p>
      </div>
    </SceneFrame>
  );
}
