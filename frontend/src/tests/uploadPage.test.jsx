import React from "react";
import { render, screen } from "@testing-library/react";
import UploadPage from "../pages/uploadPage";
import Dropzone from "../components/DirectoryComponents/Dropzone";

jest.mock("../components/DirectoryComponents/Dropzone", () => () => <div data-testid="dropzone" />);

describe("UploadPage", () => {
  it("renders the heading and Dropzone component", () => {
    render(<UploadPage />);
    
    expect(screen.getByRole("heading", { name: /upload page/i })).toBeInTheDocument();
    expect(screen.getByTestId("dropzone")).toBeInTheDocument();
  });
});