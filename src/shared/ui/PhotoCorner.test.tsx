import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhotoCorner } from "./PhotoCorner";

afterEach(cleanup);

describe("PhotoCorner", () => {
  it("is purely decorative — hidden from assistive technology", () => {
    const { container } = render(<PhotoCorner />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("never intercepts pointer events", () => {
    const { container } = render(<PhotoCorner corner="br" tone="cream" />);
    expect(container.firstElementChild?.className).toContain("pointer-events-none");
  });
});
