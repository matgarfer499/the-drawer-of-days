import type { HubObject } from "./schema";

// El arte de cada objeto es un icono SVG animado por código (ver
// src/scenes/open-box-hub/keepsakes), no un asset de contenido.
// Order = hub arrangement + guided-tour order: timeline → sky → recipes → letter
export const hubObjects: HubObject[] = [
  { id: "cassette", label: "nuestra cinta", scene: "timeline", palmSize: true },
  { id: "starmap", label: "nuestro cielo", scene: "sky", palmSize: false },
  { id: "recetario", label: "nuestro recetario", scene: "recipes", palmSize: true },
  { id: "envelope", label: "ábreme despacio", scene: "letter", palmSize: true },
];
