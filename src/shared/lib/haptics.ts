/**
 * A tiny, forgiving wrapper over the Vibration API. Haptics are a mobile-only
 * enhancement — most desktops and iOS Safari have no `navigator.vibrate`, and
 * some browsers throw if it's called outside a user gesture, so this never
 * assumes support and never throws. Call it from inside a tap/gesture handler.
 */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // some engines reject vibration outside a gesture — ignore
  }
}
