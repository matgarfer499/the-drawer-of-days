import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WashiTape } from "./WashiTape";

afterEach(cleanup);

describe("WashiTape", () => {
  it("is purely decorative — hidden from assistive technology", () => {
    const { container } = render(<WashiTape id="t1" />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("derives a stable seeded rotation from its id", () => {
    const { container } = render(<WashiTape id="t1" />);
    const el = container.firstElementChild as HTMLElement | null;
    expect(el?.style.getPropertyValue("--seed-rot")).not.toBe("");
  });
});
