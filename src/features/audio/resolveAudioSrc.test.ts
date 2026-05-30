import { describe, expect, it } from "vitest";
import { resolveAudioSrc } from "./resolveAudioSrc";

describe("resolveAudioSrc", () => {
  const byBasename = { "our-song.mp3": "/assets/our-song.a1b2.mp3" };

  it("resolves a content @assets path to its bundled URL by basename", () => {
    expect(resolveAudioSrc("@assets/audio/our-song.mp3", byBasename)).toBe(
      "/assets/our-song.a1b2.mp3",
    );
  });

  it("returns null when the asset is not in the bundle (placeholder era)", () => {
    expect(resolveAudioSrc("@assets/audio/ambient-tape.mp3", byBasename)).toBeNull();
  });

  it("matches on basename regardless of the directory prefix", () => {
    expect(resolveAudioSrc("our-song.mp3", byBasename)).toBe("/assets/our-song.a1b2.mp3");
  });

  it("returns null for an empty path", () => {
    expect(resolveAudioSrc("", byBasename)).toBeNull();
  });
});
