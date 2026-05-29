/**
 * One-time SVG filter sprite for the scrapbook material language. Mounted once in
 * `App`; props reference these filters by id (e.g. TornEdge → `filter:url(#paper-tear)`).
 * Off-screen and inert — zero size, aria-hidden, pointer-events none — so it adds the
 * filters to the document without affecting layout.
 */
export function ScrapbookDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        {/* Ragged paper edge: fractal noise displaces the alpha border of a filled shape. */}
        <filter id="paper-tear" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves={3}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={7}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
