import type { HubObject } from "./schema";

// TODO(contenido real): la etiqueta manuscrita de cada objeto. El arte es un icono SVG
// animado por código (ver src/scenes/open-box-hub/keepsakes), no un asset de contenido.
export const hubObjects: HubObject[] = [
  { id: "cassette", label: "nuestra cinta", scene: "timeline", palmSize: true },
  { id: "envelope", label: "ábreme despacio", scene: "letter", palmSize: true },
  { id: "starmap", label: "nuestro cielo", scene: "sky", palmSize: false },
  { id: "recetario", label: "nuestro recetario", scene: "recipes", palmSize: true },
];
