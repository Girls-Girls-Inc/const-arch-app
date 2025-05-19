import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EmailLinkHandler from "../pages/EmailLinkHandler";
import { MemoryRouter } from "react-router-dom";
import { useUser } from "../context/userContext";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import toast from "react-hot-toast";

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../context/userContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn(),
    isSignInWithEmailLink: jest.fn(),
    signInWithEmailLink: jest.fn(),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("EmailLinkHandler", () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({ setUser: mockSetUser });
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/verify?link=123",
      },
      writable: true,
    });
  });

  it("completes sign-in with stored email", async () => {
    localStorage.setItem("emailForSignIn", "test@example.com");

    getAuth.mockReturnValue({});
    isSignInWithEmailLink.mockReturnValue(true);
    signInWithEmailLink.mockResolvedValue({
      user: { uid: "user123", email: "test@example.com" },
    });

    render(<EmailLinkHandler />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        uid: "user123",
        email: "test@example.com",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      expect(toast.success).toHaveBeenCalledWith("Successfully verified and signed in!");
    });
  });

  it("prompts for email if not in localStorage", async () => {
    window.prompt = jest.fn().mockReturnValue("test@example.com");
    localStorage.removeItem("emailForSignIn");

    getAuth.mockReturnValue({});
    isSignInWithEmailLink.mockReturnValue(true);
    signInWithEmailLink.mockResolvedValue({
      user: { uid: "user456", email: "test@example.com" },
    });

    render(<EmailLinkHandler />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(window.prompt).toHaveBeenCalled();
      expect(mockSetUser).toHaveBeenCalledWith({
        uid: "user456",
        email: "test@example.com",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("handles invalid link", async () => {
    getAuth.mockReturnValue({});
    isSignInWithEmailLink.mockReturnValue(false);

    render(<EmailLinkHandler />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid sign-in link.");
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });
  });

  it("handles failed sign-in attempt", async () => {
    localStorage.setItem("emailForSignIn", "test@example.com");

    getAuth.mockReturnValue({});
    isSignInWithEmailLink.mockReturnValue(true);
    signInWithEmailLink.mockRejectedValue(new Error("Invalid/expired link"));

    render(<EmailLinkHandler />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Verification link invalid or expired.");
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });
  });
});
