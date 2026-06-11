/** The openable hub objects (the "spokes"). */
export type SpokeSceneId = "timeline" | "letter" | "sky" | "recipes";

/** Every node in the experience graph. */
export type SceneId = "door" | "seal" | "hub" | SpokeSceneId | "finale";

export type ReasonId = string;

/** Where the experience is, conceptually. Drives which layer is on screen. */
export type ExperienceStatus = "door" | "sealed" | "hub" | "inScene" | "finale";

export interface ExperienceState {
  status: ExperienceStatus;
  activeScene: SceneId;
  previousScene: SceneId | null;
  /** Spokes the visitor has opened — feeds the red thread and the finale gate. */
  visitedScenes: ReadonlySet<SpokeSceneId>;
  /** Letter reasons lit so far (the incremental letter). */
  unlockedReasons: ReadonlySet<ReasonId>;
  finaleUnlocked: boolean;
  finaleReached: boolean;
  /** The audio context has been resumed by a user gesture. */
  audioUnlocked: boolean;
  tour: { active: boolean; index: number };
}

export type ExperienceAction =
  | { type: "ENTER" } // door → sealed box (first user gesture, unlocks audio)
  | { type: "OPEN_BOX" } // sealed box → hub (ribbon pull)
  | { type: "ENTER_SCENE"; scene: SpokeSceneId } // hub → full-screen scene
  | { type: "CLOSE_SCENE" } // any scene → hub (the invariable close)
  | { type: "ENTER_FINALE" } // hub → finale (only once unlocked)
  | { type: "CLOSE_FINALE" } // finale → hub
  | { type: "START_TOUR" } // "show me everything" — guided, chronological
  | { type: "TOUR_NEXT" }
  | { type: "STOP_TOUR" };
