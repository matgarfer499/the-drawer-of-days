import type { Song } from "./schema";

// TODO(contenido real): MP3 de la canción + título/artista (+ segundo del estribillo) y el
// loop de ambiente casi inaudible. Revisar derechos: el repo es público.
//
// El audio vive en src/assets (gitignored como el resto de media), NO en public/. El
// AudioEngine de la Fase 8 resuelve estas rutas desde el alias @assets vía Vite —
// una ruta raíz "/assets/..." apuntaría a public/ y rompería el modelo de privacidad.
export const song: Song = {
  src: "@assets/audio/our-song.mp3",
  title: "Nuestra canción",
  artist: "Por definir",
  ambientSrc: "@assets/audio/ambient-tape.mp3",
  climaxAt: 48,
};
