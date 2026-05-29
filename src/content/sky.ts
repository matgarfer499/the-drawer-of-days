import { placeholderImage } from "./placeholders/asset";
import type { Sky } from "./schema";

// TODO(contenido real): lugares/viajes como estrellas (label + foto opcional) y 1–3 constelaciones.
export const sky: Sky = {
  nodes: [
    { id: "home", label: "casa", position: { x: 30, y: 70 } },
    {
      id: "beach",
      label: "la playa",
      position: { x: 64, y: 40 },
      media: placeholderImage({
        width: 1000,
        height: 1000,
        label: "la playa",
        alt: "Marcador de la playa",
      }),
    },
    { id: "mountains", label: "la montaña", position: { x: 48, y: 22 } },
    { id: "city", label: "la ciudad", position: { x: 20, y: 38 } },
  ],
  constellations: [
    { id: "our-places", name: "nuestros sitios", starIds: ["home", "beach", "mountains", "city"] },
  ],
  revealMessage: "Cada luz, un sitio donde fuimos felices.",
};
