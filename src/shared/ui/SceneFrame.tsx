import { useReducedMotion } from "@features/reduced-motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

const frame = tv({
  base: "absolute inset-0 grid h-[100dvh] w-[100dvw] place-items-center overflow-hidden px-6 text-center",
  variants: {
    tone: {
      paper: "bg-paper-cream text-ink-sepia",
      night: "bg-night-paper text-silver-pen",
    },
  },
  defaultVariants: { tone: "paper" },
});

interface SceneFrameProps {
  children: ReactNode;
  tone?: "paper" | "night";
}

/**
 * Full-screen container for a scene. Owns the enter/exit transition so every
 * scene animates consistently, and degrades to a plain crossfade under
 * `prefers-reduced-motion`. The real shared-element morph (layoutId) lands in
 * phase 4 — here it's a tasteful fade/scale.
 */
export function SceneFrame({ children, tone = "paper" }: SceneFrameProps) {
  const reduced = useReducedMotion();
  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
      };

  return (
    <motion.section
      className={frame({ tone })}
      {...motionProps}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
