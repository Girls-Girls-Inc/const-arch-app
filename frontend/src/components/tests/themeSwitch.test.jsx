import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeSwitch from "../ThemeSwitch";

describe("ThemeSwitch", () => {
  beforeEach(() => {
    document.body.className = "";
  });

  it("renders the theme switch", () => {
    render(<ThemeSwitch />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
  });

  it("toggles dark theme on checkbox click", () => {
    render(<ThemeSwitch />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    expect(document.body.classList.contains("dark-theme")).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
    expect(document.body.classList.contains("dark-theme")).toBe(false);
  });
});