import type { Reason } from "./schema";

// TODO(contenido real): 6–12 razones concretas (no tópicos). Las que llevan `unlockedBy`
// se encienden al ver esa escena (carta incremental); su id debe coincidir con el
// `unlocksReasonId` del scene-engine (lo verifica content.test.ts).
export const reasons: Reason[] = [
  { id: "r-laugh", order: 1, text: "Por cómo te ríes cuando algo te hace mucha gracia." },
  {
    id: "timeline",
    order: 2,
    text: "Por cada sitio al que hemos ido juntos.",
    unlockedBy: "timeline",
  },
  { id: "r-coffee", order: 3, text: "Por los desayunos lentos de los domingos." },
  { id: "sky", order: 4, text: "Por mirar el mismo cielo y acordarme de ti.", unlockedBy: "sky" },
  { id: "r-home", order: 5, text: "Porque cualquier sitio contigo es casa." },
  { id: "r-future", order: 6, text: "Por todo lo que aún nos queda por vivir." },
];
