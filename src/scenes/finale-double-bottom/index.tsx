import { SceneFrame } from "@shared/ui/SceneFrame";

/** Placeholder for the double-bottom finale — built in phase 8 (R3F paper sky + song). */
export function Finale() {
  return (
    <SceneFrame tone="night">
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-display text-4xl text-silver-pen">El doble fondo</h2>
        {/* TODO(phase 8): finale.thesisLine from @content */}
        <p className="max-w-sm font-hand text-2xl text-silver-pen">
          cabes en mi mano y a la vez llenas el cielo
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-silver-pen/70">
          placeholder · fase 8
        </p>
      </div>
    </SceneFrame>
  );
}
