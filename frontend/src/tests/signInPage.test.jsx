import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../pages/signIn';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../context/userContext';
import { signInWithEmail, withProvider } from '../Firebase/authorisation';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

jest.mock("../Firebase/authorisation", () => ({
    withProvider: jest.fn(),
    signInWithEmail: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Sign In Page', () => {
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
                        <SignIn />
                    </UserProvider>
                </MemoryRouter>
            );
        });
    });

    it('should render a form with login information and a login button and navigate to dashboard on successful login', async() => {
        const emailInput = screen.getByPlaceholderText(/email address/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(signInWithEmail).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });

        // Check for success toast
        await waitFor(() => {
            expect(screen.getByText('Logged in successfully!')).toBeInTheDocument();
        });
    });

    it('should not navigate to dashboard on unsuccessful login with email and show an error toast', async() => {
        signInWithEmail.mockRejectedValueOnce({
            code: 'auth/invalid-credential',
            message: 'Invalid email or password',
        });

        const emailInput = screen.getByPlaceholderText(/email address/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'wronguser@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(signInWithEmail).toHaveBeenCalledTimes(2);
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        const toasts = await screen.findAllByText(/Email or Password is incorrect!/i);

        expect(toasts.length).toBe(2);
        expect(toasts[0]).toBeInTheDocument();
    });

    it('should render button for 3rd party auth that call the helper function and navigate to dashboard on successful login and show toast messages', async () => {
        const googleButton = screen.getByRole('button', { name: /google/i });

        expect(googleButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(googleButton);
        });

        expect(withProvider).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

        const toasts = await screen.findAllByText(/Signed in successfully!/i);

        expect(toasts.length).toBe(1);
        expect(toasts[0]).toBeInTheDocument();
    });

    it('should render a button directing to the sign up page', () => {
        const signUpLink = screen.getByRole('link', { name: /signup instead/i });

        expect(signUpLink).toBeInTheDocument();
        expect(signUpLink).toHaveAttribute('href', '/signup');
    });

    it('should render a link for forgot password functionality', () => {
        const forgotPLink = screen.getByRole('link', { name: /forgot password/i });

        expect(forgotPLink).toBeInTheDocument();
        expect(forgotPLink).toHaveAttribute('href', '#');
    });

    it('should render a link to go back to home page', () => {
        const backLink = screen.getByRole('link', { name: /arrow_back/i });

        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/');
    });
});