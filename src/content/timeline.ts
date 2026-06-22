import { localPhoto } from "./localPhoto";
import type { Milestone } from "./schema";

/** Real milestone photo (4:5 in the Polaroid frame; object-cover crops to fit). */
const photo = (id: string, width: number, height: number, title: string) =>
  localPhoto({ path: `timeline/${id}.webp`, alt: `Foto del recuerdo: ${title}`, width, height });

export const milestones: Milestone[] = [
  {
    id: "beginning",
    date: "2023-06-24",
    side: "A",
    title: "El día que empezó todo",
    body: "Oficialmente en Nerja, aunque ya habíamos quedado y me robaste mi kebab",
    photos: [photo("beginning", 1080, 1920, "El día que empezó todo")],
  },
  {
    id: "beach",
    date: "2023-07-13",
    side: "A",
    title: "Un verano lleno de playa",
    body: "El primer verano juntos, el plan era playa y que me enseñaras por primera vez todos tus juegos de cartas.",
    photos: [photo("beach", 1500, 1125, "Un verano lleno de playa")],
  },
  {
    id: "first-payment",
    date: "2024-02-02",
    side: "A",
    title: "La primera vez que invité a cenar",
    body: "Fuimos a cenar al Rixtor después de mi primer sueldo, nunca olvidaré el apoyo que me diste durante tantos meses de búsqueda de trabajo y de incertidumbre.",
    photos: [photo("first-payment", 1200, 1600, "La primera vez que invité a cenar")],
  },
  {
    id: "first-trip",
    date: "2024-05-17",
    side: "A",
    title: "Nuestro primer viaje",
    body: "Aunque tú ya estuvieras allá, fue nuestro primer viaje juntos, me encantó poder recorrer los canales de Ámsterdam contigo y fueras mi guía exclusiva.",
    photos: [photo("first-trip", 1200, 1600, "Nuestro primer viaje")],
  },
  {
    id: "second-trip",
    date: "2024-08-22",
    side: "A",
    title: "Nuestro segundo viaje",
    body: "Esta vez juntos de principio a fin, espectacular disfrutar Milán y el Lago di Como contigo.",
    photos: [photo("second-trip", 1200, 1600, "Nuestro segundo viaje")],
  },
  {
    id: "third-trip",
    date: "2025-03-28",
    side: "A",
    title: "Nuestro tercer viaje (no paramos eh)",
    body: "Granadita, aunque con un final algo amargo porque te ibas seis meses fuera, pero fue una despedida increíble disfrutando de la ciudad y de la comida.",
    photos: [photo("third-trip", 1200, 1600, "Nuestro tercer viaje")],
  },
  {
    id: "the-forgivible-one",
    date: "2025-10-12",
    side: "A",
    title: "Qué peste a meao",
    body: "Bruselas horrible, el viaje lo salvó la cerveza y Brujas jajajaja",
    photos: [photo("the-forgivible-one", 1200, 1600, "Qué peste a meao")],
  },
  {
    id: "fourth-trip",
    date: "2025-11-14",
    side: "A",
    title: "Un cumpleaños inolvidable",
    body: "Anda que no tuvimos suerte de pillar vuelos tan baratos para Londres eh. Me encantó verte tan ilusionada celebrando tu cumpleaños allí",
    photos: [photo("fourth-trip", 1200, 1600, "Un cumpleaños inolvidable")],
  },
  {
    id: "today",
    date: "2026-06-22",
    side: "A",
    title: "Ahora mi cumple jiji",
    body: "Aunque no tuviera muchas ganas, me anima que lo celebre y poder seguir estando contigo a día de hoy.",
    photos: [photo("today", 2048, 1536, "Ahora mi cumple jiji")],
  },
];
