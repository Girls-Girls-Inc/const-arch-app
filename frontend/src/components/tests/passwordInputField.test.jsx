import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PasswordInputField from "../PasswordInputField";

describe("PasswordInputField", () => {
  const setup = () => {
    const handleChange = jest.fn();
    render(
      <PasswordInputField
        id="password"
        placeholder="Enter password"
        onChange={handleChange}
        value=""
      />
    );
    const input = screen.getByPlaceholderText("Enter password");
    const toggleIcon = screen.getByText("visibility");
    return { input, toggleIcon, handleChange };
  };

  it("renders password input with correct props", () => {
    const { input } = setup();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility when icon is clicked", () => {
    const { input, toggleIcon } = setup();

    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(toggleIcon);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByText("visibility_off"));
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange when typing", () => {
    const { input, handleChange } = setup();
    fireEvent.change(input, { target: { value: "mySecret123" } });
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });
});