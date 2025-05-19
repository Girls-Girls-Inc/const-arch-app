import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EditUpload from "../pages/editUpload";
import { BrowserRouter } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useUser } from "../context/userContext";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("../context/userContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => <div>Mocked Toaster</div>,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../components/IconButton", () => () => <div>Mocked IconButton</div>);
jest.mock("../components/NavigationComponent", () => () => <div>Mocked NavigationComponent</div>);
jest.mock("../components/NavigationDashLeft", () => () => <div>Mocked NavigationDashLeft</div>);

describe("EditUpload", () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { uid: "123" } });
    useNavigate.mockReturnValue(jest.fn());
  });

  it("displays loading spinner initially", async () => {
    useParams.mockReturnValue({ id: "test-id" });
    getDoc.mockReturnValue(
      new Promise(() => {})
    );

    render(
      <BrowserRouter>
        <EditUpload />
      </BrowserRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays error if no ID is provided", async () => {
    useParams.mockReturnValue({ id: null });

    render(
      <BrowserRouter>
        <EditUpload />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/upload not found/i)).toBeInTheDocument()
    );
  });

  it("renders upload details on successful fetch", async () => {
    useParams.mockReturnValue({ id: "test-id" });

    getDoc.mockResolvedValue({
      exists: () => true,
      id: "test-id",
      data: () => ({
        fileName: "Test File",
        fileType: "application/pdf",
        uploadedBy: "User1",
        uploadDate: new Date().toISOString(),
        updatedAt: { toDate: () => new Date() },
        filePath: "https://example.com/file.pdf",
        tags: ["tag1", "tag2"],
        bookmarkCount: 3,
        directoryId: "dir123",
        visibility: "public",
      }),
    });

    render(
      <BrowserRouter>
        <EditUpload />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/test file/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/tag1/i)).toBeInTheDocument();
    expect(screen.getByText(/test-id/i)).toBeInTheDocument();
  });
});
