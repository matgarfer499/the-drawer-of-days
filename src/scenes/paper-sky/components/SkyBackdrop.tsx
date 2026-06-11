import { cn } from "@shared/lib/cn";
import { hashId, mulberry32 } from "@shared/lib/seededRotation";
import { tv } from "tailwind-variants";

const backdrop = tv({
  slots: {
    svg: "pointer-events-none absolute inset-0 h-full w-full",
    crease: "stroke-silver-pen/8",
    moonGlow: "fill-golden-hour/10",
    moonBody: "fill-paper-cream/90",
    moonShade: "fill-night-paper/15",
    crater: "fill-aged-tan/25",
    cloud: "fill-silver-pen/8 stroke-silver-pen/12 motion-safe:animate-cloud-drift",
    hillBack: "fill-aged-tan/12 [filter:url(#paper-tear)]",
    hillFront: "fill-kraft-tan/18 [filter:url(#paper-tear)]",
    frame: "fill-none stroke-silver-pen/20",
    dot: "fill-silver-pen/60",
  },
});

// A puffy, lobed paper cloud — cut by hand, never symmetric.
const CLOUD_PATH =
  "M40 150 q 8 -20 32 -16 q 8 -16 32 -10 q 26 -6 30 12 q 20 2 15 17 q -5 12 -24 10 l -72 0 q -17 -2 -13 -13 Z";

// Literal classes so Tailwind sees them; the twinklers fire out of phase.
const TWINKLE_DELAYS = [
  "[animation-delay:0ms]",
  "[animation-delay:300ms]",
  "[animation-delay:600ms]",
  "[animation-delay:900ms]",
] as const;

// Deterministic pin-star field, computed once at module load.
const FIELD = Array.from({ length: 16 }, (_, i) => {
  const rng = mulberry32(hashId(`sky-dot-${i}`));
  return {
    x: 12 + rng() * 350,
    y: 20 + rng() * 330,
    r: 0.8 + rng() * 1.2,
    twinkle: i % 4 === 0,
    delay: TWINKLE_DELAYS[(i / 4) | 0] ?? TWINKLE_DELAYS[0],
  };
});

/**
 * The night spread behind the interactive stars: a paper moon, hand-cut clouds
 * that drift, torn-paper hills along the bottom, fold creases, a wonky pencil
 * frame and a field of faint pin-stars. One static SVG — only the clouds and a
 * few twinkling dots move, and only under motion-safe.
 */
export function SkyBackdrop() {
  const s = backdrop();
  return (
    <svg viewBox="0 0 375 700" preserveAspectRatio="none" aria-hidden="true" className={s.svg()}>
      {/* fold creases — the map has been opened many times, never quite flat */}
      <line x1="128" y1="0" x2="123" y2="700" strokeWidth="1.5" className={s.crease()} />
      <line x1="0" y1="382" x2="375" y2="377" strokeWidth="1.5" className={s.crease()} />

      {/* the paper moon, top-right */}
      <circle cx="300" cy="92" r="46" className={s.moonGlow()} />
      <circle cx="300" cy="92" r="26" className={s.moonBody()} />
      <path d="M310 72 A 26 26 0 0 1 310 112 A 21 21 0 0 0 310 72 Z" className={s.moonShade()} />
      <circle cx="292" cy="86" r="3" className={s.crater()} />
      <circle cx="305" cy="100" r="2.2" className={s.crater()} />
      <circle cx="297" cy="78" r="1.5" className={s.crater()} />

      {/* two hand-cut clouds adrift */}
      <g className={s.cloud()}>
        <path d={CLOUD_PATH} strokeWidth="1" />
      </g>
      <g
        className={cn(s.cloud(), "[animation-delay:-13s] [animation-direction:alternate-reverse]")}
      >
        <g transform="translate(180 60) scale(0.7)">
          <path d={CLOUD_PATH} strokeWidth="1" />
        </g>
      </g>

      {/* torn-paper hills along the bottom */}
      <path
        d="M-8 596 C 60 560 120 588 188 572 C 250 558 300 590 383 574 L 383 708 L -8 708 Z"
        className={s.hillBack()}
      />
      <path
        d="M-8 642 C 70 606 150 646 230 622 C 300 602 340 640 383 626 L 383 708 L -8 708 Z"
        className={s.hillFront()}
      />

      {/* a wonky hand-drawn frame, never parallel to the edges */}
      <path
        d="M10 14 L 366 9 L 368 688 L 7 692 Z"
        strokeWidth="1.5"
        strokeDasharray="3 7"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className={s.frame()}
      />

      {/* the pin-star field; every fourth one twinkles out of phase */}
      {FIELD.map((dot, i) => (
        <circle
          // biome-ignore lint/suspicious/noArrayIndexKey: the field is static and deterministic
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          className={cn(
            s.dot(),
            dot.twinkle &&
              `origin-center [transform-box:fill-box] motion-safe:animate-twinkle ${dot.delay}`,
          )}
        />
      ))}
    </svg>
  );
}
