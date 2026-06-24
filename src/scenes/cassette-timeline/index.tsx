import { content } from "@content";
import { audioEngine } from "@features/audio";
import { useReducedMotion } from "@features/reduced-motion";
import { seededTransformVars } from "@shared/lib/seededRotation";
import { Doodle } from "@shared/ui/Doodle";
import { Polaroid } from "@shared/ui/Polaroid";
import { PostmarkDate } from "@shared/ui/PostmarkDate";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { TornEdge } from "@shared/ui/TornEdge";
import { WashiTape } from "@shared/ui/WashiTape";
import { useMotionValueEvent, useScroll, useTransform, useVelocity } from "motion/react";
import { useRef, useState } from "react";
import { tv } from "tailwind-variants";
import { CASSETTE_RATE_MAX, cassetteRate, formatPostmark, nearestTrack } from "./cassette";
import { CassetteDeck } from "./components/CassetteDeck";

/** Full turns the reels make across the whole tape — pure spin feel. */
const REEL_TURNS = 6;

const ui = tv({
  slots: {
    root: "flex h-full w-full max-w-md flex-col items-center gap-3 py-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]",
    title: "font-display type-title text-3xl text-ink-sepia",
    subtitle: "-mt-1 font-hand text-2xl text-faded-rose",
    track:
      "flex w-full min-h-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    // safe center: centred when the milestone fits, top-aligned (so its top stays
    // reachable) when it's tall enough to scroll inside the panel
    panel:
      "flex w-full shrink-0 snap-center flex-col items-center [justify-content:safe_center] gap-4 overflow-y-auto overscroll-y-contain px-1",
    side: "w-fit self-center rounded-[2px] bg-kraft-tan px-2.5 py-1 font-body text-ink-sepia text-stamp uppercase tracking-[0.2em] shadow-tape rotate-[var(--seed-rot)]",
    photoGroup: "relative inline-block w-fit self-center pb-6",
    photoTape: "-top-3 -left-8 absolute z-10 -rotate-45",
    postmark:
      "-right-10 -bottom-1 absolute z-10 rounded-full bg-paper-cream/60 backdrop-blur-[1px]",
    scrap: "w-fit max-w-[34ch] self-center text-center",
    milestoneTitle: "font-display text-2xl text-ink-sepia",
    body: "max-w-[30ch] font-body text-sm leading-relaxed text-faded-ink",
    dots: "flex items-center justify-center",
    dot: "grid h-11 w-11 -mx-1 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    dotInner: "h-2.5 w-2.5 rounded-full bg-aged-tan transition-transform",
  },
  variants: {
    smooth: { true: { track: "scroll-smooth" }, false: {} },
    active: { true: { dotInner: "scale-150 bg-faded-rose" }, false: {} },
    // photo and note stay centered; alternating panels only flip which corner the
    // postmark overlaps, so the tape keeps a handmade variety without reading as a list
    flip: {
      true: {
        postmark: "-left-10 right-auto",
      },
      false: {},
    },
  },
  defaultVariants: { smooth: true, active: false, flip: false },
});

/**
 * The cassette timeline. The milestones live on a horizontal, scroll-snapped
 * tape you swipe through; the reels spin with the scroll and whirr gold the
 * faster you scrub (the same rate phase 8 will feed the audio). Under reduced
 * motion the reels rest still and the snap jumps instead of glides — the tape is
 * still fully navigable by swipe or by the dots. Keeps `spoke-timeline` so it
 * morphs from (and back to) its hub keepsake.
 */
export function CassetteTimeline() {
  const reduced = useReducedMotion();
  const milestones = content.milestones;
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const { scrollXProgress } = useScroll({ container: trackRef, axis: "x" });
  const rotate = useTransform(scrollXProgress, [0, 1], [0, REEL_TURNS * 360], { clamp: false });
  // The scrub speed (whole-track progress/sec) becomes the cassette rate. useVelocity
  // settles back to 0 on its own, so the reel "whirr" glow fades when she stops.
  const scrubRate = useTransform(useVelocity(scrollXProgress), (v) => cassetteRate(v));
  const glow = useTransform(scrubRate, (r) => (r - 1) / (CASSETTE_RATE_MAX - 1));

  useMotionValueEvent(scrollXProgress, "change", (progress) => {
    setActive(nearestTrack(progress, milestones.length));
  });

  // pitch the tape with the swipe (silent until the ambient asset is bundled)
  useMotionValueEvent(scrubRate, "change", (rate) => {
    audioEngine.setCassetteRate(rate);
  });

  const goTo = (index: number) => {
    panelRefs.current[index]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const s = ui({ smooth: !reduced });

  return (
    <SceneFrame morphId="spoke-timeline" flavor="slide">
      <div className={s.root()}>
        <h1 className={s.title()}>{content.scenes.timeline.title}</h1>
        <p className={s.subtitle()}>{content.scenes.timeline.tagline}</p>

        <CassetteDeck {...(reduced ? {} : { rotate, glow })} />

        <section
          ref={trackRef}
          className={s.track()}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-focusable so a keyboard user can arrow-scrub the tape (WCAG 2.1.1); the dots provide discrete nav alongside
          tabIndex={0}
          aria-roledescription="carrusel"
          aria-label="La cinta: desliza para recorrer los recuerdos"
        >
          {milestones.map((milestone, index) => {
            const photo = milestone.photos[0];
            const flip = index % 2 === 1;
            return (
              <article
                key={milestone.id}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                className={s.panel()}
                aria-roledescription="recuerdo"
                aria-label={`${index + 1} de ${milestones.length}: ${milestone.title}`}
              >
                <span
                  className={s.side({ flip })}
                  style={seededTransformVars(`side-${milestone.id}`, {
                    maxRotation: 5,
                    maxOffset: 3,
                  })}
                >
                  Cara {milestone.side}
                </span>
                <span className={s.photoGroup({ flip })}>
                  <span aria-hidden="true" className={s.photoTape()}>
                    <WashiTape id={`tl-tape-${milestone.id}`} tone="sage" length="sm" />
                  </span>
                  {photo ? (
                    <Polaroid id={milestone.id} src={photo.src} alt={photo.alt} size="sm" />
                  ) : null}
                  <PostmarkDate
                    id={`pm-${milestone.id}`}
                    date={formatPostmark(milestone.date)}
                    dateTime={milestone.date}
                    className={s.postmark({ flip })}
                  />
                </span>
                <TornEdge id={`scrap-${milestone.id}`} tone="cream" className={s.scrap({ flip })}>
                  <h2 className={s.milestoneTitle()}>{milestone.title}</h2>
                  <Doodle
                    id={`underline-${milestone.id}`}
                    kind="wave"
                    tone="sage"
                    size="sm"
                    className="-mt-1"
                  />
                  <p className={s.body()}>{milestone.body}</p>
                </TornEdge>
              </article>
            );
          })}
        </section>

        <nav className={s.dots()} aria-label="Saltar a un recuerdo">
          {milestones.map((milestone, index) => (
            <button
              key={milestone.id}
              type="button"
              className={s.dot()}
              aria-label={`Ir a: ${milestone.title}`}
              aria-current={active === index}
              onClick={() => goTo(index)}
            >
              <span className={s.dotInner({ active: active === index })} />
            </button>
          ))}
        </nav>
      </div>
    </SceneFrame>
  );
}
