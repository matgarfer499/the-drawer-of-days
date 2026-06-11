import { stitchPath } from "@shared/lib/stitchPath";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThreadLine } from "./ThreadLine";

afterEach(cleanup);

const from = { x: 10, y: 20 };
const to = { x: 80, y: 70 };

describe("ThreadLine", () => {
  it("is decorative — hidden from assistive technology", () => {
    const { container } = render(<ThreadLine id="t" from={from} to={to} />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("draws the seeded stitch path between the two points", () => {
    const { container } = render(<ThreadLine id="t" from={from} to={to} />);
    expect(container.querySelector("path")?.getAttribute("d")).toBe(stitchPath(from, to, "t"));
  });

  it("keeps the stroke uniform under non-uniform scaling (round stitches, even width)", () => {
    const { container } = render(<ThreadLine id="t" from={from} to={to} />);
    expect(container.querySelector("path")?.getAttribute("vector-effect")).toBe(
      "non-scaling-stroke",
    );
  });

  it("threads in other tones keep the same stitch, only recoloured", () => {
    const { container } = render(<ThreadLine id="t" from={from} to={to} tone="silver" />);
    const path = container.querySelector("path");
    expect(path?.getAttribute("d")).toBe(stitchPath(from, to, "t"));
    expect(path?.getAttribute("class")).toContain("stroke-silver-pen");
  });
});
