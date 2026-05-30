import { useReducedMotion } from "@features/reduced-motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

const frame = tv({
  slots: {
    section:
      "absolute inset-0 grid h-[100dvh] w-[100dvw] place-items-center overflow-hidden px-6 text-center",
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

interface SceneFrameProps {
  children: ReactNode;
  tone?: "paper" | "night";
  /** shared-layout id: the hub keepsake with the same id morphs into this hero */
  morphId?: string;
  /** make the surface transparent so a layer behind it shows through */
  bare?: boolean;
}

/**
 * Full-screen container for a scene. Owns the consistent enter/exit transition and
 * degrades to a plain crossfade under prefers-reduced-motion. When given a
 * `morphId`, it renders a hero panel that the matching hub keepsake grows into
 * (and shrinks back to on close) — the shared-element morph. Reduced motion drops
 * the morph entirely.
 */
export function SceneFrame({ children, tone = "paper", morphId, bare = false }: SceneFrameProps) {
  const reduced = useReducedMotion();
  const { section, hero } = frame({ tone, bare });
  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
      };

  return (
    <motion.section
      className={section()}
      {...motionProps}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {morphId && !reduced ? (
        <motion.div
          aria-hidden="true"
          layoutId={morphId}
          className={hero()}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
      ) : null}
      {children}
    </motion.section>
  );
}
