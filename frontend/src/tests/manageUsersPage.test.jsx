import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ManageUsers from "../pages/manageUsers";
import { useUser } from "../context/userContext";
import * as firestore from "firebase/firestore";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-hot-toast";

jest.mock("react-hot-toast", () => ({
  toast: {
    loading: jest.fn(),
    dismiss: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}));

jest.mock("../components/NavigationComponent", () => () => <div>Nav</div>);
jest.mock("../components/NavigationDashLeft", () => () => <div>NavLeft</div>);

jest.mock("../context/userContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

describe("ManageUsers Component", () => {
  const mockUsers = [
    { id: "1", email: "admin@example.com", isAdmin: true },
    { id: "2", email: "user@example.com", isAdmin: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders and shows user table for admin", async () => {
    useUser.mockReturnValue({
      user: { email: "admin@example.com" },
      loading: false,
      setUser: jest.fn(),
      isAdmin: true,
    });

    firestore.getDocs.mockResolvedValue({
      docs: mockUsers.map((user) => ({
        id: user.id,
        data: () => ({ email: user.email, isAdmin: user.isAdmin }),
      })),
    });

    render(
      <Router>
        <ManageUsers />
      </Router>
    );

    expect(screen.getByText("Nav")).toBeInTheDocument();
    expect(screen.getByText("NavLeft")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("admin@example.com")).toBeInTheDocument();
      expect(screen.getByText("user@example.com")).toBeInTheDocument();
    });
  });

  it("displays message if user is not admin", () => {
    useUser.mockReturnValue({
      user: { email: "user@example.com" },
      loading: false,
      setUser: jest.fn(),
      isAdmin: false,
    });

    render(
      <Router>
        <ManageUsers />
      </Router>
    );

    expect(screen.getByText("You do not have permission to view this page.")).toBeInTheDocument();
  });

  it("toggles admin status", async () => {
    useUser.mockReturnValue({
      user: { email: "admin@example.com" },
      loading: false,
      setUser: jest.fn(),
      isAdmin: true,
    });

    firestore.getDocs.mockResolvedValue({
      docs: mockUsers.map((user) => ({
        id: user.id,
        data: () => ({ email: user.email, isAdmin: user.isAdmin }),
      })),
    });

    render(
      <Router>
        <ManageUsers />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("user@example.com")).toBeInTheDocument();
    });

    const toggle = screen.getByLabelText("User");
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(firestore.updateDoc).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("User is now an admin");
    });
  });
});
