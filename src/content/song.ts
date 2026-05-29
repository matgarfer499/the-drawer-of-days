import type { Song } from "./schema";

// TODO(contenido real): MP3 de la canción + título/artista (+ segundo del estribillo) y el
// loop de ambiente casi inaudible. Revisar derechos: el repo es público.
export const song: Song = {
  src: "/assets/audio/our-song.mp3",
  title: "Nuestra canción",
  artist: "Por definir",
  ambientSrc: "/assets/audio/ambient-tape.mp3",
  climaxAt: 48,
};
