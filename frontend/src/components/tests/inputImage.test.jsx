import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputImage from "../InputImage";
import { useUser } from "../../context/userContext";

// Mock useUser hook
jest.mock("../../context/userContext", () => ({
  useUser: jest.fn(),
}));

describe("InputImage component", () => {
  const mockUser = {
    photoURL: "https://example.com/profile.jpg",
    displayName: "Test User",
  };

  beforeEach(() => {
    useUser.mockReturnValue({ user: mockUser });
  });

  it("should render user photo and name", () => {
    render(<InputImage />);

    const image = screen.getByAltText("Profile");
    const welcomeText = screen.getByText(/Welcome, Test User/i);

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockUser.photoURL);
    expect(welcomeText).toBeInTheDocument();
  });

  it("should fallback to default image if no photoURL", () => {
    useUser.mockReturnValueOnce({ user: { displayName: "Anonymous" } });

    render(<InputImage />);
    const image = screen.getByAltText("Profile");
    expect(image).toHaveAttribute("src", expect.stringContaining("via.placeholder.com"));
  });

  it("should display default name if displayName is missing", () => {
    useUser.mockReturnValueOnce({ user: { photoURL: null } });

    render(<InputImage />);
    const defaultName = screen.getByText(/Welcome, User/i);
    expect(defaultName).toBeInTheDocument();
  });

  it("should handle file input change", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<InputImage />);
    const fileInput = screen.getByTestId("file-input");

    const file = new File(["dummy"], "profile.png", { type: "image/png" });

    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [file] },
    });

    expect(consoleSpy).toHaveBeenCalledWith("Selected file:", file);
    consoleSpy.mockRestore();
  });
});