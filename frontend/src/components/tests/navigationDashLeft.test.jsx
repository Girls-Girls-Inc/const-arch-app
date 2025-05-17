import React from "react";
import { useUser } from "../../context/userContext";
import * as auth from "../../Firebase/authorisation";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import NavigationDashLeft from "../NavigationDashLeft";

const mockSetUser = jest.fn();
const mockUseUser = jest.fn();

jest.mock("../../context/userContext", () => ({
    useUser: () => mockUseUser(),
}));

jest.spyOn(auth, "handleLogout").mockImplementation(() => { });

describe("Navigation Dash Left", () => {
    beforeEach(() => {
        mockUseUser.mockReturnValue({
            user: { email: "test@example.com" },
            setUser: mockSetUser,
            isAdmin: false,
        });
    });

    it("should render the panel with correct buttons for a normal user", () => {
        render(
            <MemoryRouter>
                <NavigationDashLeft />
            </MemoryRouter>
        );

        expect(screen.getByText("My Profile")).toBeInTheDocument();
        expect(screen.getByText("Bookmarks")).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
        expect(screen.getByText("Log Out")).toBeInTheDocument();
        expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("should call handleLogout when logout button clicked", () => {
        render(
            <MemoryRouter>
                <NavigationDashLeft />
            </MemoryRouter>
        );

        const logoutButton = screen.getByText("Log Out");
        fireEvent.click(logoutButton);

        expect(auth.handleLogout).toHaveBeenCalled();
    });

    it("should render admin menu items if the user is an admin", () => {
        mockUseUser.mockReturnValue({
            user: { email: "admin@example.com" },
            setUser: mockSetUser,
            isAdmin: true,
        });

        render(
            <MemoryRouter>
                <NavigationDashLeft />
            </MemoryRouter>
        );

        expect(screen.getByText((_, el) => el?.textContent === "Directory")).toBeInTheDocument();
        expect(screen.getByText((_, el) => el?.textContent === "Manage Users")).toBeInTheDocument();
        expect(screen.getByText((_, el) => el?.textContent === "Manage uploads")).toBeInTheDocument();
    })
})