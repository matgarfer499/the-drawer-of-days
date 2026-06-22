import { localPhoto } from "./localPhoto";
import type { Sky } from "./schema";

/** Real photo for a sky node (shown as a Polaroid when the star is tapped). */
const photo = (id: string, width: number, height: number, label: string) =>
  localPhoto({ path: `sky/${id}.webp`, alt: `Foto de ${label}`, width, height });

export const sky: Sky = {
  nodes: [
    {
      id: "home",
      label: "casa",
      position: { x: 30, y: 70 },
      media: photo("home", 1200, 1600, "casa"),
    },
    {
      id: "beach",
      label: "la playa",
      position: { x: 64, y: 40 },
      media: photo("beach", 1170, 2080, "la playa"),
    },
    {
      id: "mountains",
      label: "la montaña",
      position: { x: 48, y: 22 },
      media: photo("mountains", 2048, 1536, "la montaña"),
    },
    {
      id: "city",
      label: "la ciudad",
      position: { x: 20, y: 38 },
      media: photo("city", 1200, 1600, "la ciudad"),
    },
  ],
  constellations: [
    { id: "our-places", name: "nuestros sitios", starIds: ["home", "beach", "mountains", "city"] },
  ],
  revealMessage: "Cada luz, un sitio donde fuimos felices.",
};
