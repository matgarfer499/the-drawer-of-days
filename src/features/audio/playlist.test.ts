import { describe, expect, it } from "vitest";
import { nextIndex, prevIndex, resolvePlaylist } from "./playlist";

describe("nextIndex (wrap-around)", () => {
  it("advances by one", () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(nextIndex(1, 3)).toBe(2);
  });

  it("wraps from the last track back to the first", () => {
    expect(nextIndex(2, 3)).toBe(0);
  });

  it("stays at 0 for an empty playlist", () => {
    expect(nextIndex(0, 0)).toBe(0);
  });

  it("wraps a single-track playlist to itself", () => {
    expect(nextIndex(0, 1)).toBe(0);
  });
});

describe("prevIndex (wrap-around)", () => {
  it("steps back by one", () => {
    expect(prevIndex(2, 3)).toBe(1);
    expect(prevIndex(1, 3)).toBe(0);
  });

  it("wraps from the first track to the last", () => {
    expect(prevIndex(0, 3)).toBe(2);
  });

  it("stays at 0 for an empty playlist", () => {
    expect(prevIndex(0, 0)).toBe(0);
  });
});

describe("resolvePlaylist", () => {
  const track = (over: Partial<Parameters<typeof resolvePlaylist>[0][number]>) => ({
    id: "t",
    title: "T",
    artist: "A",
    src: "https://blob/song.mp3",
    art: "https://blob/art.webp",
    artAlt: "Portada",
    ...over,
  });

  it("passes absolute song + art URLs straight through", () => {
    const out = resolvePlaylist([track({})], {});
    expect(out).toEqual([
      {
        id: "t",
        title: "T",
        artist: "A",
        src: "https://blob/song.mp3",
        art: "https://blob/art.webp",
        artAlt: "Portada",
      },
    ]);
  });

  it("drops tracks with no playable audio source (env URL absent)", () => {
    const out = resolvePlaylist([track({ id: "a", src: "" }), track({ id: "b" })], {});
    expect(out.map((t) => t.id)).toEqual(["b"]);
  });

  it("keeps the song but nulls the art when the art URL is absent", () => {
    const out = resolvePlaylist([track({ art: "" })], {});
    expect(out[0]?.art).toBeNull();
  });

  it("resolves a bundled basename song against the dev bundle", () => {
    const out = resolvePlaylist([track({ src: "song-1.mp3" })], {
      "song-1.mp3": "/assets/song-1.hash.mp3",
    });
    expect(out[0]?.src).toBe("/assets/song-1.hash.mp3");
  });
});
