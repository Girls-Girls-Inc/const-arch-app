import React from "react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/home";
import { screen, render } from "@testing-library/react";

describe('Home Page', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  });

  it('displays the page title', () => {
    expect(screen.getByText('Constitutional Archive App')).toBeInTheDocument();
  });

  it('renders the Sign In link with correct href', () => {
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signIn');
  });

  it('renders the Sign Up link with correct href', () => {
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/signUp');
  });
});