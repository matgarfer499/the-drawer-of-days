import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";
import { ascendingLayout } from "./ascending";
import { AscendingPhoto } from "./components/AscendingPhoto";

const { thesisLine, ascendingPhotos, promise } = content.finale;

const ui = tv({
  slots: {
    root: "absolute inset-0 h-full w-full overflow-hidden",
    photos: "pointer-events-none absolute inset-0",
    center:
      "absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-6 px-8 text-center",
    eyebrow: "font-body text-silver-pen/60 text-xs uppercase tracking-[0.3em]",
    thesis:
      "max-w-md font-display text-2xl text-silver-pen leading-snug [text-shadow:0_0_20px_var(--color-golden-hour)]",
    promise: "flex flex-col items-center gap-2",
    frame:
      "flex min-h-24 w-44 flex-col items-center justify-center gap-1 rounded-sm border border-silver-pen/40 border-dashed p-3",
    frameLabel: "font-hand text-xl text-silver-pen",
    pending: "font-body text-silver-pen/50 text-xs uppercase tracking-[0.2em]",
    note: "max-w-xs font-hand text-lg text-silver-pen/80",
  },
});

/**
 * The double-bottom finale: the secret compartment. Our polaroids lift into a
 * paper sky and settle, the thesis line glows, and a frame is left deliberately
 * empty — the promise, "our next chapter", a blank we fill ourselves. The photos
 * stay in the DOM (real alt text); phase 8b adds the WebGL paper-sky backdrop
 * behind them. Reduced motion settles everything at rest. No morphId — the finale
 * is reached through the gate, not by morphing a keepsake.
 */
export function Finale() {
  const reduced = useReducedMotion() ?? false;
  const layout = ascendingLayout(ascendingPhotos.length, content.seed);
  const s = ui();

  return (
    <SceneFrame tone="night" bare={!reduced}>
      <div className={s.root()}>
        <div className={s.photos()}>
          {ascendingPhotos.map((photo, i) => {
            const spot = layout[i];
            if (!spot) return null;
            // resting heights spread across the upper sky, in lift order
            const y = 18 + (i / Math.max(1, ascendingPhotos.length - 1)) * 46;
            return (
              <AscendingPhoto
                key={photo.src}
                id={`finale-photo-${i}`}
                photo={photo}
                x={spot.x}
                y={y}
                rotate={spot.rotate}
                delay={spot.delay}
                reduced={reduced}
              />
            );
          })}
        </div>

        <div className={s.center()}>
          <p className={s.eyebrow()}>El doble fondo</p>
          <motion.h2
            className={s.thesis()}
            initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: reduced ? 0 : 0.4, duration: 1.1, ease: "easeOut" }}
          >
            {thesisLine}
          </motion.h2>

          <div className={s.promise()}>
            <div className={s.frame()}>
              <span className={s.frameLabel()}>{promise.frameLabel}</span>
              <span className={s.pending()}>— por escribir —</span>
            </div>
            <p className={s.note()}>{promise.note}</p>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}
