import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavigationComponent from "../NavigationComponent";
import { useUser } from "../../context/userContext";
import * as auth from "../../Firebase/authorisation";
import { MemoryRouter } from "react-router-dom";

const mockSetUser = jest.fn();
const mockUseUser = jest.fn();

jest.mock("../../context/userContext", () => ({
  useUser: () => mockUseUser(),
}));

jest.spyOn(auth, "handleLogout").mockImplementation(() => { });

describe("NavigationComponent", () => {

  beforeEach(() => {
    mockUseUser.mockReturnValue({
      user: { email: "test@example.com" },
      setUser: mockSetUser,
      isAdmin: false,
    });
  });

  it("renders menu toggle button", () => {
    render(
      <MemoryRouter>
        <NavigationComponent />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /☰/ })).toBeInTheDocument();
  });

  it("toggles mobile menu for normal user on button click", () => {
    render(
      <MemoryRouter>
        <NavigationComponent />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole("button", { name: /☰/ });

    expect(screen.queryByText("My Profile")).not.toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("calls handleLogout when logout button is clicked", () => {
    render(
      <MemoryRouter>
        <NavigationComponent />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /☰/ }));

    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);

    expect(auth.handleLogout).toHaveBeenCalled();
  });

  it("renders admin menu items if user is admin", () => {
    mockUseUser.mockReturnValue({
      user: { email: "admin@example.com" },
      setUser: mockSetUser,
      isAdmin: true,
    });

    render(
      <MemoryRouter>
        <NavigationComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /☰/ }));

    expect(screen.getByText((_, el) => el?.textContent === "Directory")).toBeInTheDocument();
    expect(screen.getByText((_, el) => el?.textContent === "Manage Users")).toBeInTheDocument();
    expect(screen.getByText((_, el) => el?.textContent === "Manage uploads")).toBeInTheDocument();
  });
});