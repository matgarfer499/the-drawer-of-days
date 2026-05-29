import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PostmarkDate } from "./PostmarkDate";

afterEach(cleanup);

describe("PostmarkDate", () => {
  it("renders the date as readable text", () => {
    render(<PostmarkDate id="m1" date="14 FEB 2023" />);
    expect(screen.getByText("14 FEB 2023")).toBeTruthy();
  });

  it("uses a <time> element with a machine-readable datetime when provided", () => {
    const { container } = render(<PostmarkDate id="m1" date="14 FEB 2023" dateTime="2023-02-14" />);
    expect(container.querySelector("time")?.getAttribute("datetime")).toBe("2023-02-14");
  });

  it("shows the place when given", () => {
    render(<PostmarkDate id="m1" date="14 FEB 2023" place="Madrid" />);
    expect(screen.getByText("Madrid")).toBeTruthy();
  });
});
