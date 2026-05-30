import { content } from "@content";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PaperSky } from "./index";

afterEach(cleanup);

const star = (label: string) => screen.getByRole("button", { name: new RegExp(label, "i") });

describe("PaperSky", () => {
  it("offers a star for every place in the sky", () => {
    render(<PaperSky />);
    for (const node of content.sky.nodes) {
      expect(star(node.label)).toBeTruthy();
    }
  });

  it("emerges a place's photo when its star is lit", () => {
    render(<PaperSky />);
    const withPhoto = content.sky.nodes.find((node) => node.media);
    if (!withPhoto?.media) throw new Error("fixture expects a sky node with media");
    expect(screen.queryByAltText(withPhoto.media.alt)).toBeNull();
    fireEvent.click(star(withPhoto.label));
    expect(screen.getByAltText(withPhoto.media.alt)).toBeTruthy();
  });

  it("traces the hidden message once every star is lit", () => {
    render(<PaperSky />);
    expect(screen.queryByText(content.sky.revealMessage)).toBeNull();
    for (const node of content.sky.nodes) fireEvent.click(star(node.label));
    expect(screen.getByText(content.sky.revealMessage)).toBeTruthy();
  });
});
