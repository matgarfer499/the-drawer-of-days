import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { StampPin } from "@shared/ui/StampPin";
import { ThreadLine } from "@shared/ui/ThreadLine";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";
import { ascendingLayout } from "./ascending";
import { AscendingPhoto } from "./components/AscendingPhoto";
import { Closing } from "./components/Closing";
import { DoubleBottomReveal } from "./components/DoubleBottomReveal";

const { label, thesisLine, ascendingPhotos, promise, closing } = content.finale;

const ui = tv({
  slots: {
    root: "absolute inset-0 h-full w-full overflow-hidden",
    photos: "pointer-events-none absolute inset-0",
    // ground mist under the words: keeps the thesis legible over the sky and the
    // ascending photos, in motion and in the reduced static collage alike
    scrim:
      "pointer-events-none absolute top-[62%] left-1/2 z-[5] h-[58%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-radial from-night-paper/75 via-night-paper/35 to-transparent",
    // safe end keeps the thesis reachable if the column ever overflows; the
    // bottom reserve clears the absolutely-pinned "continuar" cue (≈1.5rem + 44px)
    // even when Safari's toolbar shrinks dvh, so the promise never sits under it
    center:
      "absolute inset-0 z-10 flex flex-col items-center [justify-content:safe_end] gap-6 overflow-y-auto overscroll-contain px-8 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(12dvh,6rem)] text-center",
    eyebrow: "font-body text-silver-pen/75 text-xs uppercase tracking-[0.3em]",
    thesis:
      "max-w-md font-display type-tender text-3xl text-silver-pen leading-snug [text-shadow:0_0_20px_var(--color-golden-hour)]",
    promise: "flex flex-col items-center gap-2",
    frame:
      "relative flex min-h-24 w-44 flex-col items-center justify-center gap-1 rounded-sm bg-silver-pen/5 p-3",
    frameLabel: "font-hand text-xl text-silver-pen",
    pending: "font-body text-silver-pen/80 text-xs uppercase tracking-[0.2em]",
    note: "max-w-xs font-hand text-lg text-silver-pen/80",
  },
});

/**
 * The double-bottom finale: the secret compartment. Our polaroids lift into a
 * paper sky and settle, the thesis line glows, and a frame is left deliberately
 * empty — the promise, "our next chapter", a blank we fill ourselves. The photos
 * stay in the DOM (real alt text) over the WebGL paper-sky backdrop (CanvasLayer).
 * Reduced motion settles everything at rest and drops the canvas. No morphId — the
 * finale is reached through the gate, not by morphing a keepsake.
 */
export function Finale() {
  const reduced = useReducedMotion() ?? false;
  const layout = ascendingLayout(ascendingPhotos.length, content.seed);
  const s = ui();
  // wait for the last photo to finish rising (step 0.5s + ~0.9s lift) before the
  // closing cue invites the tap; reduced motion offers it at once
  const settleDelayMs = reduced ? 0 : (ascendingPhotos.length * 0.5 + 1.4) * 1000;

  return (
    <SceneFrame tone="night" bare={!reduced} flavor="nightfall">
      <div className={s.root()}>
        {/* the false bottom dissolving into the sky, on top until it clears */}
        <DoubleBottomReveal reduced={reduced} />

        {/* heading first in the DOM so AT reaches the thesis before the photos */}
        <div className={s.center()}>
          <p className={s.eyebrow()}>{label}</p>
          <motion.h1
            className={s.thesis()}
            initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: reduced ? 0 : 0.4, duration: 1.1, ease: "easeOut" }}
          >
            {thesisLine}
          </motion.h1>

          <div className={s.promise()}>
            <div className={s.frame()}>
              {/* the empty frame is hand-stitched in golden thread, a wobbly
                  rectangle pinned to the night — never a clean dashed border */}
              <ThreadLine
                id="promise-top"
                tone="golden"
                from={{ x: 4, y: 6 }}
                to={{ x: 96, y: 4 }}
                maxSag={3}
              />
              <ThreadLine
                id="promise-right"
                tone="golden"
                from={{ x: 96, y: 4 }}
                to={{ x: 95, y: 95 }}
                maxSag={3}
              />
              <ThreadLine
                id="promise-bottom"
                tone="golden"
                from={{ x: 95, y: 95 }}
                to={{ x: 5, y: 96 }}
                maxSag={3}
              />
              <ThreadLine
                id="promise-left"
                tone="golden"
                from={{ x: 5, y: 96 }}
                to={{ x: 4, y: 6 }}
                maxSag={3}
              />
              <StampPin
                id="promise-pin"
                kind="pin"
                tone="golden"
                className="-top-1 absolute right-7"
              />
              <span className={s.frameLabel()}>{promise.frameLabel}</span>
              <span className={s.pending()}>{promise.pendingLabel}</span>
            </div>
            <p className={s.note()}>{promise.note}</p>
          </div>
        </div>

        <div className={s.scrim()} aria-hidden="true" />

        <div className={s.photos()}>
          {ascendingPhotos.map((photo, i) => {
            const spot = layout[i];
            if (!spot) return null;
            // photos keep to the upper band, hugging alternating edges, so the
            // thesis and the promise stay clear of them on a phone; the band starts
            // low enough that the (larger) topmost polaroids stay fully on-screen
            const y = 16 + (i / Math.max(1, ascendingPhotos.length - 1)) * 24;
            const x = i % 2 === 0 ? 10 + (spot.x / 100) * 26 : 64 + (spot.x / 100) * 26;
            return (
              <AscendingPhoto
                key={photo.src}
                id={`finale-photo-${i}`}
                photo={photo}
                x={x}
                y={y}
                rotate={spot.rotate}
                delay={spot.delay}
                reduced={reduced}
              />
            );
          })}
        </div>

        {/* the curtain: cue, then the farewell that ends the presentation */}
        <Closing closing={closing} reduced={reduced} settleDelayMs={settleDelayMs} />
      </div>
    </SceneFrame>
  );
}
