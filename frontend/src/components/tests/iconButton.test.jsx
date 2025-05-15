import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IconButton from "../IconButton";
import { MemoryRouter } from "react-router-dom";

describe("IconButton", () => {
  it("renders as a <button> when onClick is provided", () => {
    const handleClick = jest.fn();
    render(<IconButton icon="test_icon" label="Click Me" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders as a <button> when type is submit", () => {
    render(<IconButton icon="send" label="Submit" type="submit" />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders as a <Link> when no onClick and no submit type", () => {
    render(
      <MemoryRouter>
        <IconButton route="/home" icon="home" label="Home" />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toHaveAttribute("href", "/home");
  });

  it("displays the icon and label", () => {
    render(
      <MemoryRouter>
        <IconButton route="/test" icon="star" label="Starred" />
      </MemoryRouter>
    );
    expect(screen.getByText("Starred")).toBeInTheDocument();
    expect(screen.getByText("star")).toBeInTheDocument();
  });
});