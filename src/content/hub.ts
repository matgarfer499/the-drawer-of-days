import { placeholderImage } from "./placeholders/asset";
import type { HubObject } from "./schema";

// TODO(contenido real): el arte recortado de cada objeto (PNG con alfa, ~600px) + su etiqueta.
export const hubObjects: HubObject[] = [
  {
    id: "cassette",
    label: "nuestra cinta",
    scene: "timeline",
    palmSize: true,
    art: placeholderImage({ width: 600, height: 600, label: "casete", alt: "Un casete de cinta" }),
  },
  {
    id: "envelope",
    label: "ábreme despacio",
    scene: "letter",
    palmSize: true,
    art: placeholderImage({ width: 600, height: 600, label: "sobre", alt: "Un sobre cerrado" }),
  },
  {
    id: "starmap",
    label: "nuestro cielo",
    scene: "sky",
    palmSize: false,
    art: placeholderImage({
      width: 600,
      height: 600,
      label: "mapa estelar",
      alt: "Un mapa de estrellas dibujado a mano",
    }),
  },
];
