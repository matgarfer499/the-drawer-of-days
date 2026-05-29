// A small boundary so the rest of the app imports reduced-motion from one place
// instead of reaching into `motion` or the DOM directly.

export { onReducedMotionChange, prefersReducedMotion } from "@shared/lib/prefersReducedMotion";
export { useReducedMotion } from "motion/react";
