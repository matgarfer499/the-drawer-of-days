import { assetRefSchema } from "@content/schema";
import { describe, expect, it } from "vitest";
import { placeholderImage } from "./asset";

describe("placeholderImage", () => {
  it("returns a valid AssetRef with the requested dimensions", () => {
    const asset = placeholderImage({ width: 1200, height: 1500, label: "foto", alt: "una foto" });
    expect(assetRefSchema.safeParse(asset).success).toBe(true);
    expect(asset.width).toBe(1200);
    expect(asset.height).toBe(1500);
  });

  it("encodes a renderable inline SVG data URI", () => {
    const asset = placeholderImage({ width: 100, height: 100, label: "x", alt: "x" });
    expect(asset.src.startsWith("data:image/svg+xml,")).toBe(true);
  });

  it("escapes XML-special characters in the label", () => {
    const asset = placeholderImage({ width: 100, height: 100, label: "tú & yo", alt: "x" });
    expect(asset.src).not.toContain("& ");
    expect(decodeURIComponent(asset.src)).toContain("&amp;");
  });

  it("is deterministic for the same inputs", () => {
    const opts = { width: 10, height: 10, label: "x", alt: "y" };
    expect(placeholderImage(opts)).toEqual(placeholderImage(opts));
  });
});
