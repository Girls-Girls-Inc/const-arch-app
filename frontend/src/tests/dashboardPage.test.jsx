import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../pages/dashboard";
import { useUser } from "../context/userContext";
import { useNavigate, MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock("../context/userContext", () => ({
    useUser: jest.fn(),
}));

describe("Dashboard", () => {
    const mockUser = {
        displayName: "John Doe",
        phone: null,
        email: "john@example.com",
    };

    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should display loading message while loading", () => {
        useUser.mockReturnValue({ user: mockUser, loading: true });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should navigate to /signIn if user is not logged in", async () => {
        useUser.mockReturnValue({ user: null, loading: false });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/signIn");
        });
    });

    it("should render dashboard when user is logged in", () => {
        useUser.mockReturnValue({ user: mockUser, loading: false });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        expect(screen.getByText("First name")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Phone number")).toBeInTheDocument();
        expect(screen.getByText("Not provided")).toBeInTheDocument();
        expect(screen.getByText("Email address")).toBeInTheDocument();
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
        expect(screen.getByText("Physical address")).toBeInTheDocument();
        expect(screen.getByText("No address")).toBeInTheDocument();
    });
});