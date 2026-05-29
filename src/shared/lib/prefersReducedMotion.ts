const QUERY = "(prefers-reduced-motion: reduce)";

/** SSR-safe read of the user's reduced-motion preference. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(QUERY).matches;
}

/** Subscribe to changes in the reduced-motion preference. Returns an unsubscribe fn. */
export function onReducedMotionChange(cb: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mql = window.matchMedia(QUERY);
  const handler = (event: MediaQueryListEvent) => cb(event.matches);
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}
