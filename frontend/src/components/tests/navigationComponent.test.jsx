import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavigationComponent from "../NavigationComponent";
import { useUser } from "../../context/userContext";
import * as auth from "../../Firebase/authorisation";
import { MemoryRouter } from "react-router-dom"; 

jest.mock("../../context/userContext", () => ({
  useUser: () => ({ setUser: jest.fn() }),
}));

jest.spyOn(auth, "handleLogout").mockImplementation(() => {});

describe("NavigationComponent", () => {
  it("renders menu toggle button", () => {
    render(
      <MemoryRouter>
        <NavigationComponent />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /☰/ })).toBeInTheDocument();
  });

  it("toggles mobile menu on button click", () => {
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
    expect(screen.getByText("Directory")).toBeInTheDocument();
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
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
});