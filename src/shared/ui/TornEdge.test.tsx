import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TornEdge } from "./TornEdge";

afterEach(cleanup);

describe("TornEdge", () => {
  it("renders its children on top of the torn paper", () => {
    render(<TornEdge id="note">Una nota</TornEdge>);
    expect(screen.getByText("Una nota")).toBeTruthy();
  });

  it("ragged-edges a decorative paper layer with the shared paper-tear filter", () => {
    const { container } = render(<TornEdge id="note">x</TornEdge>);
    const paper = container.querySelector('[aria-hidden="true"]');
    expect(paper).not.toBeNull();
    expect(paper?.className).toContain("[filter:url(#paper-tear)]");
  });
});
