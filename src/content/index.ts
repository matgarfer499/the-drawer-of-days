import { finale } from "./finale";
import { hubObjects } from "./hub";
import { meta, opening } from "./meta";
import { reasons } from "./reasons";
import { recipes } from "./recipes";
import { scenes } from "./scenes";
import { contentSchema } from "./schema";
import { sky } from "./sky";
import { song } from "./song";
import { milestones } from "./timeline";

/**
 * The validated content tree. The schema is parsed at import time, so if real
 * content ever breaks the contract the app fails LOUDLY here (in dev/build),
 * never silently at runtime. To swap in real content, edit the files in this
 * folder and drop assets into `src/assets` — the UI never changes.
 */
export const content = contentSchema.parse({
  ...meta,
  opening,
  scenes,
  hubObjects,
  milestones,
  recipes,
  reasons,
  sky,
  song,
  finale,
});

export type {
  AssetRef,
  Constellation,
  Content,
  Finale,
  HubObject,
  Milestone,
  Opening,
  Reason,
  RecipeCard,
  RecipeCardKind,
  SceneCopy,
  Sky,
  SkyNode,
  Song,
} from "./schema";
