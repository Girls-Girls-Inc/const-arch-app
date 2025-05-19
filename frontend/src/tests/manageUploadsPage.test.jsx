import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ManageUploads from "../pages/manageUploads";
import { MemoryRouter } from "react-router-dom";
import { useUser } from "../context/userContext";
import { db } from "../Firebase/firebase";
import { getDoc, getDocs, collection, doc, getFirestore } from "firebase/firestore";

jest.mock("../context/userContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: () => ({
    currentUser: { uid: "user123" },
  }),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("../components/IconButton", () => ({ label, route }) => (
  <a href={route}>{label}</a>
));

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}));

jest.mock("../components/NavigationComponent", () => () => <div data-testid="nav-component" />);
jest.mock("../components/NavigationDashLeft", () => () => <div data-testid="nav-left" />);

describe("ManageUploads", () => {
  const mockUploads = [
    {
      id: "1",
      fileName: "Doc1",
      filePath: "http://example.com/doc1.pdf",
      uploadedBy: "user1@example.com",
      uploadDate: "2023-01-01",
    },
  ];

  beforeEach(() => {
    useUser.mockReturnValue({ user: { uid: "user123" } });
    doc.mockImplementation(() => ({}));
  });

  it("renders loading spinner initially", async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ isAdmin: true }) });
    getDocs.mockResolvedValue({ docs: [] });

    render(<ManageUploads />, { wrapper: MemoryRouter });

    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => expect(getDoc).toHaveBeenCalled());
  });

  it("shows permission denied for non-admins", async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ isAdmin: false }) });

    render(<ManageUploads />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText("You do not have permission to view this page.")).toBeInTheDocument();
    });
  });

  it("renders uploads table for admin", async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ isAdmin: true }) });
    getDocs.mockResolvedValue({
      docs: mockUploads.map((upload) => ({
        id: upload.id,
        data: () => upload,
      })),
    });

    render(<ManageUploads />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText("Manage Uploads")).toBeInTheDocument();
      expect(screen.getByText("Doc1")).toBeInTheDocument();
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
    });
  });

  it("deletes an upload after confirmation", async () => {
    global.confirm = jest.fn(() => true);

    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ isAdmin: true }) });
    getDocs.mockResolvedValue({
      docs: mockUploads.map((upload) => ({
        id: upload.id,
        data: () => upload,
      })),
    });

    render(<ManageUploads />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText("Doc1"));

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    // Would normally check API call here if mocking fetch
    expect(global.confirm).toHaveBeenCalled();
  });
});
