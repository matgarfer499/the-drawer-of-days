import { z } from "zod";

/**
 * The content model — Zod is the single source of truth. Every type below is
 * INFERRED with `z.infer` (never hand-written), and the whole tree is validated
 * on import (see ./index.ts) so dropping in real content can never fail silently.
 */

/** Spoke scenes a hub object opens / a reason is unlocked by. Mirrors
 *  scene-engine's `SpokeSceneId` — kept in sync by schema.cross.test.ts. */
export const spokeSceneIdSchema = z.enum(["timeline", "letter", "sky", "recipes"]);

/** A reference to an image/clip asset. Real files drop into `src/assets` later;
 *  `width`/`height` are mandatory so the layout never shifts (CLS = 0). */
export const assetRefSchema = z.object({
  src: z.string().min(1, { error: "El asset necesita una ruta (src)." }),
  alt: z.string().min(1, { error: "Toda imagen necesita alt en español (a11y)." }),
  width: z.int().min(1, { error: "width en píxeles es obligatorio (CLS = 0)." }),
  height: z.int().min(1, { error: "height en píxeles es obligatorio (CLS = 0)." }),
  /** tiny LQIP shown blurred while the full asset loads (blur-up) */
  blurDataURL: z.string().optional(),
});
export type AssetRef = z.infer<typeof assetRefSchema>;

/** A point on the paper sky, as a percentage of the viewport (0–100 per axis). */
const skyPositionSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

/** The door + sealed-box copy. */
export const openingSchema = z.object({
  greetingLine: z.string().min(1),
  /** the prominent line while the bow is tied: pull the ribbon */
  subGreetingLine: z.string().min(1),
  /** the prominent line once untied: lift the lid (advances with the phase) */
  subLidLine: z.string().min(1),
  /** hint shown while the bow is still tied: pull the knot sideways */
  ribbonHint: z.string().min(1),
  /** hint shown once untied: lift the lid */
  lidHint: z.string().min(1),
});
export type Opening = z.infer<typeof openingSchema>;

/** A keepsake in the open box that opens a spoke. Its art is a code-driven,
 *  animated SVG icon (a UI concern, keyed by `scene`), not a content asset. */
export const hubObjectSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  scene: spokeSceneIdSchema,
  /** fits in the palm — feeds the finale's "cabes en mi mano" */
  palmSize: z.boolean().default(true),
});
export type HubObject = z.infer<typeof hubObjectSchema>;

/** A timeline milestone (a cassette track). */
export const milestoneSchema = z.object({
  id: z.string().min(1),
  /** ISO date, YYYY-MM-DD */
  date: z.iso.date(),
  title: z.string().min(1),
  body: z.string().min(1),
  photos: z.array(assetRefSchema).readonly(),
  /** cassette face */
  side: z.enum(["A", "B"]).default("A"),
});
export type Milestone = z.infer<typeof milestoneSchema>;

/** A recipe card in the recetario: a dish we cook at home, or a meal/place we love eating out. */
export const recipeCardKindSchema = z.enum(["home", "out"]);
export type RecipeCardKind = z.infer<typeof recipeCardKindSchema>;

export const recipeCardSchema = z.object({
  id: z.string().min(1),
  /** home = lo cocinamos juntos; out = salimos a comerlo */
  kind: recipeCardKindSchema,
  /** the dish (home) or the restaurant/meal (out) */
  title: z.string().min(1),
  /** home → la anécdota/los ingredientes; out → el sitio y por qué nos gusta */
  note: z.string().min(1),
  photo: assetRefSchema,
});
export type RecipeCard = z.infer<typeof recipeCardSchema>;

/** A reason in the letter — lights up as its scene is seen (incremental letter). */
export const reasonSchema = z.object({
  id: z.string().min(1),
  order: z.int().min(1),
  text: z.string().min(1),
  unlockedBy: spokeSceneIdSchema.optional(),
});
export type Reason = z.infer<typeof reasonSchema>;

/** A star/place on the paper sky. */
export const skyNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  media: assetRefSchema.optional(),
  position: skyPositionSchema,
});
export type SkyNode = z.infer<typeof skyNodeSchema>;

/** A named figure joining several sky nodes. */
export const constellationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  starIds: z.array(z.string().min(1)).min(2).readonly(),
});
export type Constellation = z.infer<typeof constellationSchema>;

const skySchema = z.object({
  nodes: z.array(skyNodeSchema).readonly(),
  constellations: z.array(constellationSchema).readonly(),
  revealMessage: z.string().min(1),
});
export type Sky = z.infer<typeof skySchema>;

/** The finale song (+ its ambient loop). */
export const songSchema = z.object({
  src: z.string().min(1),
  title: z.string().min(1),
  artist: z.string().min(1),
  /** near-silent loop from box-open until the finale swell */
  ambientSrc: z.string().min(1),
  /** second the chorus hits, to sync the finale swell */
  climaxAt: z.number().min(0).optional(),
});
export type Song = z.infer<typeof songSchema>;

const promiseSchema = z.object({
  frameLabel: z.string().min(1),
  /** intentionally empty — the promise is the blank still to be filled */
  pendingDate: z.literal(""),
  /** what stands in for the empty date in the frame, e.g. "— por escribir —" */
  pendingLabel: z.string().min(1),
  note: z.string().min(1),
});

/** The closing curtain — the end screen revealed after the double bottom. */
const closingSchema = z.object({
  /** the discreet affordance that invites the tap, e.g. "continuar" */
  cue: z.string().min(1),
  /** the farewell line, e.g. "Y que sean muchos más" */
  message: z.string().min(1),
  /** the signature under the message, e.g. "— por muchos años más, contigo" */
  signature: z.string().min(1),
});

/** The double-bottom finale. */
export const finaleSchema = z.object({
  /** the secret compartment's name, shown as the eyebrow */
  label: z.string().min(1),
  thesisLine: z.string().min(1),
  ascendingPhotos: z.array(assetRefSchema).min(1).readonly(),
  promise: promiseSchema,
  closing: closingSchema,
});
export type Finale = z.infer<typeof finaleSchema>;

/** A scene's on-screen title and its handwritten tagline. */
export const sceneCopySchema = z.object({
  title: z.string().min(1),
  tagline: z.string().min(1),
});
export type SceneCopy = z.infer<typeof sceneCopySchema>;

const hasUniqueIds = (items: ReadonlyArray<{ id: string }>): boolean =>
  new Set(items.map((item) => item.id)).size === items.length;

/** The whole content tree. `.refine`s enforce cross-references a flat schema can't. */
export const contentSchema = z
  .object({
    anniversaryDate: z.iso.date(),
    relationshipStartDate: z.iso.date(),
    /** global seed — reshuffles every seeded transform at once */
    seed: z.int().min(0),
    opening: openingSchema,
    scenes: z.object({
      timeline: sceneCopySchema,
      letter: sceneCopySchema,
      sky: sceneCopySchema,
      recipes: sceneCopySchema,
    }),
    hubObjects: z.array(hubObjectSchema).min(1).readonly(),
    milestones: z.array(milestoneSchema).min(1).readonly(),
    recipes: z.array(recipeCardSchema).min(1).readonly(),
    reasons: z.array(reasonSchema).min(1).readonly(),
    sky: skySchema,
    song: songSchema,
    finale: finaleSchema,
  })
  .refine((c) => hasUniqueIds(c.hubObjects), { error: "hubObjects: los ids deben ser únicos." })
  .refine((c) => hasUniqueIds(c.milestones), { error: "milestones: los ids deben ser únicos." })
  .refine((c) => hasUniqueIds(c.recipes), { error: "recipes: los ids deben ser únicos." })
  .refine((c) => hasUniqueIds(c.reasons), { error: "reasons: los ids deben ser únicos." })
  .refine((c) => hasUniqueIds(c.sky.nodes), { error: "sky.nodes: los ids deben ser únicos." })
  .refine((c) => hasUniqueIds(c.sky.constellations), {
    error: "sky.constellations: los ids deben ser únicos.",
  })
  .refine(
    (c) => {
      const ids = new Set(c.sky.nodes.map((n) => n.id));
      return c.sky.constellations.every((con) => con.starIds.every((s) => ids.has(s)));
    },
    { error: "sky.constellations: cada starId debe referirse a un sky node existente." },
  );
export type Content = z.infer<typeof contentSchema>;
