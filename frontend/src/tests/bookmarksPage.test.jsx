jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useNavigate: jest.fn(),
    };
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Bookmarks from "../pages/bookmarks";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

jest.mock("../context/userContext", () => ({
    useUser: jest.fn(),
}));

jest.mock("../components/NavigationComponent", () => () => <div data-testid="nav" />);
jest.mock("../components/NavigationDashLeft", () => () => <div data-testid="sidebar" />);
jest.mock("../components/BookMarksContent", () => () => <div data-testid="content" />);

describe("Bookmarks page", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
    });

    it("shows loading message when loading is true", () => {
        useUser.mockReturnValue({ user: null, loading: true });

        render(<Bookmarks />, { wrapper: MemoryRouter });

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("navigates to /signIn if not loading and no user", async () => {
        useUser.mockReturnValue({ user: null, loading: false });

        render(<Bookmarks />, { wrapper: MemoryRouter });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("renders navigation and content when user is present", () => {
        useUser.mockReturnValue({ user: { uid: "123" }, loading: false });

        render(<Bookmarks />, { wrapper: MemoryRouter });

        expect(screen.getByTestId("nav")).toBeInTheDocument();
        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(screen.getByTestId("content")).toBeInTheDocument();
    });
});