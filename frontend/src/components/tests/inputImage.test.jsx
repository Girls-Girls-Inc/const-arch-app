import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputImage, { handleFileChange } from "../InputImage";
import { useUser } from "../../context/userContext";

// mock the useUser hook
jest.mock("../../context/userContext", () => ({
  useUser: jest.fn(),
}));

describe("InputImage", () => {
  const baseUser = {
    uid: "123",
    photoURL: "https://example.com/profile.jpg",
    displayName: "Test User",
    metadata: {
      creationTime: "2020-05-15T00:00:00Z",
    },
  };

  beforeEach(() => {
    useUser.mockReturnValue({ user: baseUser });
  });

  it("renders the user's photo and display name", () => {
    render(<InputImage onImageUpload={jest.fn()} />);

    const img = screen.getByAltText("Profile");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", baseUser.photoURL);

    expect(
      screen.getByRole("heading", { name: /welcome, test user/i })
    ).toBeInTheDocument();
  });

  it("formats and shows the 'Member since' date correctly", () => {
    render(<InputImage onImageUpload={jest.fn()} />);
    expect(screen.getByText(/Member since\s+May '20/i)).toBeInTheDocument();
  });

  it("falls back to default image if photoURL is missing", () => {
    useUser.mockReturnValueOnce({
      user: { ...baseUser, photoURL: null, metadata: {} },
    });
    render(<InputImage onImageUpload={jest.fn()} />);

    const img = screen.getByAltText("Profile");
    expect(img.src).toContain("/assets/logo.png");
  });

  it("falls back to 'User' if displayName is missing", () => {
    useUser.mockReturnValueOnce({
      user: { ...baseUser, displayName: null, metadata: {} },
    });
    render(<InputImage onImageUpload={jest.fn()} />);

    expect(screen.getByRole("heading", { name: /welcome, user/i })).toBeInTheDocument();
  });

  it("invokes onImageUpload when a file is selected", () => {
    const mockOnUpload = jest.fn();
    const { container } = render(
      <InputImage canUpload={true} onImageUpload={mockOnUpload} />
    );

    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnUpload).toHaveBeenCalledWith(file);

    const img = screen.getByAltText("Profile");
    expect(img.src).toMatch(/^blob:/);
  });

  it("does not render file input when canUpload is false", () => {
    const { container } = render(<InputImage canUpload={false} />);
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });
});

describe("handleFileChange function", () => {
  let setPreviewURL;
  let onImageUpload;

  beforeEach(() => {
    setPreviewURL = jest.fn();
    onImageUpload = jest.fn();
  });

  it("returns early if canUpload is false", () => {
    const e = { target: { files: [new File([""], "image.png")] } };
    handleFileChange(e, false, onImageUpload, setPreviewURL);
    expect(setPreviewURL).not.toHaveBeenCalled();
    expect(onImageUpload).not.toHaveBeenCalled();
  });

  it("returns early if no file is selected", () => {
    const e = { target: { files: [] } };
    handleFileChange(e, true, onImageUpload, setPreviewURL);
    expect(setPreviewURL).not.toHaveBeenCalled();
    expect(onImageUpload).not.toHaveBeenCalled();
  });

  it("sets preview and calls onImageUpload if file is present and canUpload is true", () => {
    const file = new File(["file contents"], "file.png");
    const e = { target: { files: [file] } };

    global.URL.createObjectURL = jest.fn(() => "blob:test-url");

    handleFileChange(e, true, onImageUpload, setPreviewURL);

    expect(setPreviewURL).toHaveBeenCalledWith("blob:test-url");
    expect(onImageUpload).toHaveBeenCalledWith(file);
  });
});
