---
name: audio-howler
description: Use when working on audio — the Howler AudioEngine singleton, unlocking audio via the open-the-box gesture, the ambient loop vs the reserved finale song, the cassette pitch (rate) tied to the timeline swipe, or the accessible mute control. Covers why audio is a singleton, the autoplay-policy-friendly unlock, and the layered sound design.
---

## What I do

Own all sound through a **single `AudioEngine`** (Howler) so audio never restarts between scenes and never
violates autoplay policy.

## When to use me

- Anything touching `src/features/audio/` or playing sound from a scene.
- Wiring the gesture unlock, the finale song, or the cassette pitch.

## Rules

- **One singleton `AudioEngine`**, instantiated once and mounted in `App` — never a `Howl` per component
  (that would restart sound on unmount). This is a core reason the app is a SPA.
- **Unlock by gesture, no banner:** the audio context resumes (`Howler.ctx.resume()` / first play) inside
  the *pull-the-ribbon / open-the-box* handler. Sets `audioUnlocked` in the store.
- **Layers:** (1) near-inaudible ambient loop starts on open; (2) diegetic SFX per scene (cassette click,
  envelope paper); (3) **the song is reserved** — it only becomes the lead in the finale (`enterFinale`
  fades ambient → song; map `climaxAt`/stems to the swell if available).
- **Cassette pitch:** on the timeline horizontal swipe, vary `Howl.rate()` subtly to sell "rewinding".
- Components call a declarative `useAudio()` API (play/duck/setSongPhase) that mirrors state into the store;
  they never poke Howler directly.

## Accessibility

- **Never autoplay forced.** A mute/volume control is always visible and reachable; the whole experience
  works in silence (audio is enhancement, never a requirement). Respect users who open muted.
