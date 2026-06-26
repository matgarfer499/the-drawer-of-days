import { useReducedMotion } from "@features/reduced-motion";
import { motion, type TargetAndTransition, type Transition } from "motion/react";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants";
import { GrainOverlay } from "./GrainOverlay";

const frame = tv({
  slots: {
    // a flex column (not grid) so an `h-full` scene root resolves to a real
    // 100dvh — grid's auto row left height:100% unresolved, starving the
    // scenes' inner flex-1 scroll regions and clipping their bottom controls.
    // items-center + justify-center keeps the both-axes centring short scenes rely on.
    section:
      "absolute inset-0 flex h-[100dvh] w-[100dvw] flex-col items-center justify-center overflow-hidden text-center",
    hero: "absolute inset-3 -z-10 rounded-[2rem]",
  },
  variants: {
    tone: {
      paper: { section: "bg-paper-cream text-ink-sepia", hero: "bg-kraft-tan/30 shadow-paper" },
      night: { section: "bg-night-paper text-silver-pen", hero: "bg-silver-pen/10 shadow-paper" },
    },
    // drop the surface so a persistent layer behind it (the finale's WebGL sky)
    // shows through; keeps the tone's text colour
    bare: { true: { section: "bg-transparent" }, false: {} },
  },
  defaultVariants: { tone: "paper", bare: false },
});

type Flavor = "fade" | "slide" | "unfold" | "nightfall" | "flip";

// Each flavor is the scene's own way of arriving — the gesture of its object:
// tape pulled across (slide), a letter opening (unfold), dusk settling
// (nightfall), a recipe card flipped up (flip). Transform/opacity only; the
// reduced-motion crossfade below replaces all of them.
const FLAVORS: Record<
  Flavor,
  { initial: TargetAndTransition; exit: TargetAndTransition; transition: Transition }
> = {
  fade: {
    initial: { opacity: 0, scale: 0.98 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  slide: {
    initial: { opacity: 0, x: 56, scale: 0.985 },
    exit: { opacity: 0, x: -56, scale: 1.01 },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
  unfold: {
    initial: { opacity: 0, y: 28, scaleY: 0.94, rotateX: 7, transformPerspective: 1000 },
    exit: { opacity: 0, y: -12, scaleY: 0.97 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  nightfall: {
    initial: { opacity: 0, scale: 1.05 },
    exit: { opacity: 0, scale: 1.04 },
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
  },
  flip: {
    initial: { opacity: 0, rotateX: 12, y: 36, transformPerspective: 1200 },
    exit: { opacity: 0, rotateX: -8, y: -18 },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

interface SceneFrameProps {
  children: ReactNode;
  tone?: "paper" | "night";
  /** shared-layout id: the hub keepsake with the same id morphs into this hero */
  morphId?: string;
  /** make the surface transparent so a layer behind it shows through */
  bare?: boolean;
  /** the scene's enter/exit personality; default "fade" (the original transition) */
  flavor?: Flavor;
}

/**
 * Full-screen container for a scene. Owns the enter/exit transition — each scene
 * may pick a `flavor` that matches its gesture — and degrades to a plain
 * crossfade under prefers-reduced-motion. When given a `morphId`, it renders a
 * hero panel that the matching hub keepsake grows into (and shrinks back to on
 * close) — the shared-element morph. Reduced motion drops the morph entirely.
 * Every non-bare frame is finished with a film of paper grain.
 */
export function SceneFrame({
  children,
  tone = "paper",
  morphId,
  bare = false,
  flavor = "fade",
}: SceneFrameProps) {
  const reduced = useReducedMotion();
  const { section, hero } = frame({ tone, bare });
  const { initial, exit, transition } = FLAVORS[flavor];
  const motionProps = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as Transition,
      }
    : {
        initial,
        animate: { opacity: 1, x: 0, y: 0, scale: 1, scaleY: 1, rotateX: 0 },
        exit,
        transition,
      };

  return (
    <motion.section className={section()} {...motionProps}>
      {morphId && !reduced ? (
        <motion.div
          aria-hidden="true"
          layoutId={morphId}
          className={hero()}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
      ) : null}
      {children}
      {!bare && <GrainOverlay tone={tone} className="z-30" />}
    </motion.section>
  );
}
