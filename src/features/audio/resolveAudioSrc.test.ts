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

  it("passes an absolute https URL straight through (streamed blob, never bundled)", () => {
    const url = "https://example-cdn.test/audio/track-abc123.mp3";
    expect(resolveAudioSrc(url, byBasename)).toBe(url);
  });

  it("passes an absolute http URL straight through", () => {
    const url = "http://localhost:4321/sample.mp3";
    expect(resolveAudioSrc(url, byBasename)).toBe(url);
  });

  it("does not basename-match an absolute URL against the bundle", () => {
    // the URL's basename collides with a bundled file, but the URL must win
    const url = "https://cdn.example.com/audio/our-song.mp3";
    expect(resolveAudioSrc(url, byBasename)).toBe(url);
  });
});
