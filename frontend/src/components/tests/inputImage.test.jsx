import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputImage, { handleFileChange } from "../InputImage";
import { useUser } from "../../context/userContext";

jest.mock("../../context/userContext", () => ({
  useUser: jest.fn(),
}));

global.URL.createObjectURL = jest.fn(() => "mocked-image-url");

describe("InputImage Component", () => {
  const mockUser = {
    displayName: "Jane Doe",
    photoURL: "https://example.com/photo.jpg",
    metadata: {
      creationTime: "2022-04-15T00:00:00.000Z",
    },
  };

  beforeEach(() => {
    useUser.mockReturnValue({ user: mockUser });
  });

  test("renders profile image and welcome text", () => {
    render(<InputImage />);

    expect(screen.getByTestId("profile-img")).toHaveAttribute(
      "src",
      mockUser.photoURL
    );
    expect(screen.getByTestId("welcome-text")).toHaveTextContent("Welcome, Jane Doe");
  });

  test("displays correct member since date", () => {
    render(<InputImage />);
    expect(screen.getByTestId("member-since")).toHaveTextContent("Member since Apr '22");
  });

  test("calls handleFileChange and updates image preview on file input", () => {
    const mockUpload = jest.fn();
    render(<InputImage onImageUpload={mockUpload} />);

    const fileInput = screen.getByTestId("file-input");
    const mockFile = new File(["dummy"], "photo.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    expect(mockUpload).toHaveBeenCalledWith(mockFile);
    expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
  });

  test("does not render input when canUpload is false", () => {
    render(<InputImage canUpload={false} />);
    expect(screen.queryByTestId("file-input")).toBeNull();
  });
});
