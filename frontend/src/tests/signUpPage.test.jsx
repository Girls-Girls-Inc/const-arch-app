import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../pages/signUp';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../context/userContext';
import { signUpWithEmail, withProvider } from '../Firebase/authorisation';
import { useNavigate } from "react-router-dom";

jest.mock("../Firebase/authorisation", () => ({
  withProvider: jest.fn(),
  signUpWithEmail: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Sign Up Page', () => {
  const mockNavigate = jest.fn();

  beforeEach(async () => {
    withProvider.mockResolvedValue({
      uid: '1234',
      displayName: 'Test User',
      email: 'testuser@example.com',
    });

    mockNavigate.mockClear();
    useNavigate.mockReturnValue(mockNavigate);

    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <SignUp />
          </UserProvider>
        </MemoryRouter>
      );
    });
  });

  it('renders form fields and sign-up button, and navigates to dashboard on successful signup', async () => {
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();

    signUpWithEmail.mockResolvedValue({
      uid: '1234',
      email: 'testuser@example.com',
    });

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass123!' } });
      fireEvent.click(signUpButton);
    });

    await waitFor(() => {
      expect(signUpWithEmail).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows validation errors and prevents signup with weak password', async () => {
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: '123' } });
    });

    expect(await screen.findByText(/Password should be at least 6 characters./i)).toBeInTheDocument();
    expect(await screen.findByText(/Password should contain at least one letter./i)).toBeInTheDocument();
    expect(await screen.findByText(/Password should contain at least one special character./i)).toBeInTheDocument();
  });

  it('shows error toast on signup failure', async () => {
    signUpWithEmail.mockRejectedValueOnce({
      code: 'auth/email-already-in-use',
      message: 'Email already in use',
    });

    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass123!' } });
      fireEvent.click(signUpButton);
    });

    await waitFor(() => {
      expect(signUpWithEmail).toHaveBeenCalled();
    });

    expect(await screen.findByText(/This email is already in use!/i)).toBeInTheDocument();
  });

  it('renders third-party buttons and triggers social signups', async () => {
    const googleButton = screen.getByRole('button', { name: /google/i });
    const facebookButton = screen.getByRole('button', { name: /facebook/i });

    expect(googleButton).toBeInTheDocument();
    expect(facebookButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(googleButton);
      fireEvent.click(facebookButton);
    });

    expect(withProvider).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('renders a link to sign in page', () => {
    const signInLink = screen.getByRole('link', { name: /login instead/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signin');
  });

  it('renders a link to go back to home page', () => {
    const backLink = screen.getByRole('link', { name: /arrow_back/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });
});
