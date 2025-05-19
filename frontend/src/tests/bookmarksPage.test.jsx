import React from "react";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import BookmarksPage from "../pages/bookmarks";
import { useUser } from "../context/userContext";
import { BrowserRouter as Router } from "react-router-dom";
import * as firestore from "firebase/firestore";
import toast from "react-hot-toast";

// Mocks
jest.mock("../context/userContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayRemove: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(() => "toast-id"),
    dismiss: jest.fn(),
  },
  Toaster: () => <div />,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("BookmarksPage Component", () => {
  const mockUser = { uid: "user123" };

  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({ user: mockUser });
  });

  it("renders loading state and shows bookmarks if found", async () => {
    const mockBookmarks = {
      exists: () => true,
      data: () => ({ documentIds: ["doc1"] }),
    };

    firestore.getDoc.mockResolvedValue(mockBookmarks);
    firestore.getDocs.mockResolvedValue({
      docs: [
        {
          id: "doc1",
          data: () => ({
            fileName: "Test Document",
            filePath: "https://example.com/test.pdf",
            uploadDate: new Date().toISOString(),
            tags: ["tag1", "tag2"],
          }),
        },
      ],
    });

    await act(async () => {
      render(
        <Router>
          <BookmarksPage />
        </Router>
      );
    });

    expect(await screen.findByText("Test Document")).toBeInTheDocument();
    expect(firestore.getDoc).toHaveBeenCalled();
    expect(firestore.getDocs).toHaveBeenCalled();
  });

  it("shows a message if no bookmarks found", async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ documentIds: [] }),
    });

    await act(async () => {
      render(
        <Router>
          <BookmarksPage />
        </Router>
      );
    });

    expect(screen.getByText("No bookmarks found.")).toBeInTheDocument();
  });

  it("redirects if no user is logged in", async () => {
    useUser.mockReturnValue({ user: null });

    await act(async () => {
      render(
        <Router>
          <BookmarksPage />
        </Router>
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("removes a bookmark when button clicked", async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ documentIds: ["doc1"] }),
    });

    firestore.getDocs.mockResolvedValue({
      docs: [
        {
          id: "doc1",
          data: () => ({
            fileName: "Removable Doc",
            filePath: "https://example.com/test.pdf",
            uploadDate: new Date().toISOString(),
            tags: [],
          }),
        },
      ],
    });

    await act(async () => {
      render(
        <Router>
          <BookmarksPage />
        </Router>
      );
    });

    const removeBtn = screen.getByTestId("remove-bookmark");
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(firestore.updateDoc).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Removed bookmark for "Removable Doc"');
    });
  });
});
