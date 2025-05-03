import React from 'react';
import { render, screen, act } from '@testing-library/react';
import SignIn from '../pages/signIn';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../context/userContext';

describe('Sign In Page', () => {
    beforeEach(async() => {
        await act(async() => {
            render(
                <MemoryRouter>
                    <UserProvider>
                        <SignIn />
                    </UserProvider>
                </MemoryRouter>
            );
        });
    });

    it('should render a form with login information and a login button', () => {
        const emailInput = screen.getByPlaceholderText(/email address/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
    });

    it('should render buttons for 3rd party auth', () => {
        const googleButton = screen.getByRole('button',{name: /google/i});
        const facebookButton = screen.getByRole('button',{name: /facebook/i});

        expect(googleButton).toBeInTheDocument();
        expect(facebookButton).toBeInTheDocument();
    });

    it('should render a button directing to the sign up page', () => {
        const signUpLink = screen.getByRole('link', {name: /signup instead/i});

        expect(signUpLink).toBeInTheDocument();
        expect(signUpLink).toHaveAttribute('href','/signup');
    })

    it('should render a link for forgot password functionality', () => {
        const forgotPLink = screen.getByRole('link', {name: /forgot password/i});

        expect(forgotPLink).toBeInTheDocument();
        expect(forgotPLink).toHaveAttribute('href', '#');
    })

    it('should render a link to go back to home page', () => {
        const backLink = screen.getByRole('link', {name: /arrow_back/i});

        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href','/');
    })
});