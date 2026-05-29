import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Polaroid } from "./Polaroid";

afterEach(cleanup);

describe("Polaroid", () => {
  it("renders the photo with its required alt text", () => {
    render(<Polaroid id="p1" src="/a.jpg" alt="Nosotros en la playa" />);
    expect(screen.getByRole("img", { name: "Nosotros en la playa" })).toBeTruthy();
  });

  it("shows a handwritten caption when given, and omits it otherwise", () => {
    const { rerender } = render(<Polaroid id="p1" src="/a.jpg" alt="foto" caption="verano 2023" />);
    expect(screen.getByText("verano 2023")).toBeTruthy();

    rerender(<Polaroid id="p1" src="/a.jpg" alt="foto" />);
    expect(screen.queryByText("verano 2023")).toBeNull();
  });

  it("derives the handmade tilt from its id via a seeded CSS variable", () => {
    const { container } = render(<Polaroid id="beach" src="/a.jpg" alt="foto" />);
    const figure = container.querySelector("figure");
    expect(figure?.style.getPropertyValue("--seed-rot")).not.toBe("");
  });
});
