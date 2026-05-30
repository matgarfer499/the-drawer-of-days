/**
 * Pure logic for the cassette timeline: reading the postmark date, snapping the
 * horizontal scroll to a milestone, and the playback rate the scrub feeds the
 * (phase 8) audio engine. No DOM, no motion — just numbers and strings, so the
 * scene's feel is unit-tested.
 */

const MONTHS_ES = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
] as const;

/**
 * An ISO date (`YYYY-MM-DD`) as an inked Spanish postmark, e.g. `"14 SEP 2021"`.
 * Reads the digits literally (no `Date` parsing) so it never drifts a day across
 * timezones, and drops the leading zero on the day.
 */
export function formatPostmark(iso: string): string {
  const [year, month, day] = iso.split("-");
  const monthLabel = MONTHS_ES[Number(month) - 1] ?? "";
  return `${Number(day)} ${monthLabel} ${year}`;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * The milestone closest to whole-track scroll `progress` (0–1), given `count`
 * snap panels. Clamps overshoot and never divides by zero for a lone milestone.
 */
export function nearestTrack(progress: number, count: number): number {
  if (count <= 1) return 0;
  return clamp(Math.round(progress * (count - 1)), 0, count - 1);
}

const RATE_SCALE = 1;
/** The fastest the tape ever plays — also normalises the reel "whirr" glow. */
export const CASSETTE_RATE_MAX = 2.5;

/**
 * The cassette playback rate for a scrub `velocity` (whole-track progress per
 * second, signed). Rests at 1 when still and speeds up with how fast you scrub
 * in either direction, clamped so a hard flick never shrieks. Phase 8 feeds this
 * straight into `AudioEngine.rate()`.
 */
export function cassetteRate(velocity: number): number {
  return clamp(1 + Math.abs(velocity) * RATE_SCALE, 1, CASSETTE_RATE_MAX);
}
