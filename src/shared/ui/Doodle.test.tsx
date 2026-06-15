import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Doodle } from "./Doodle";

afterEach(cleanup);

describe("Doodle", () => {
  it("is purely decorative — hidden from assistive technology", () => {
    const { container } = render(<Doodle id="d1" kind="heart" />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("derives a stable seeded tilt from its id", () => {
    const { container } = render(<Doodle id="d1" kind="wave" />);
    const el = container.firstElementChild as HTMLElement | null;
    expect(el?.style.getPropertyValue("--seed-rot")).not.toBe("");
  });
});
