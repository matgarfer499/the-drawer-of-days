import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PaperFrame } from "./PaperFrame";

afterEach(cleanup);

describe("PaperFrame", () => {
  it("renders its children", () => {
    render(<PaperFrame>Querida tú</PaperFrame>);
    expect(screen.getByText("Querida tú")).toBeTruthy();
  });

  it("merges a passed className onto the surface", () => {
    const { container } = render(<PaperFrame className="custom-x">hi</PaperFrame>);
    expect(container.firstElementChild?.className).toContain("custom-x");
  });
});
