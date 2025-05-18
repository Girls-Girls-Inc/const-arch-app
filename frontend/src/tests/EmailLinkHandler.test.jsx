import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailLinkHandler from '../pages/EmailLinkHandler.jsx';

// Mocks
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockSetUser = jest.fn();
jest.mock('../context/userContext', () => ({
  useUser: () => ({ setUser: mockSetUser }),
}));

// Firebase mocks
const mockIsLink = jest.fn();
const mockSignIn = jest.fn();
jest.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  isSignInWithEmailLink: (auth, url) => mockIsLink(auth, url),
  signInWithEmailLink: (auth, email, url) => mockSignIn(auth, email, url),
}));

// Helpers
const ORIGINAL_LOCATION = window.location;
beforeEach(() => {
  jest.clearAllMocks();
  delete window.location;
  window.location = { href: 'https://app.test/auth?oobCode=ABC' };
  window.localStorage.clear();
});
afterAll(() => {
  window.location = ORIGINAL_LOCATION;
});

describe('EmailLinkHandler', () => {
  test('invalid link navigates to signin with error toast', async () => {
    mockIsLink.mockReturnValue(false);
    
    render(<EmailLinkHandler />);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
      const { toast } = require('react-hot-toast');
      expect(toast.error).toHaveBeenCalledWith('Invalid sign-in link.');
    });
  });

  test('prompts for email and completes sign-in on valid link when no stored email', async () => {
    mockIsLink.mockReturnValue(true);
    const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('prompted@example.com');
    const removeSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    mockSignIn.mockResolvedValue({ user: { uid: 'u1' } });

    render(<EmailLinkHandler />);

    await waitFor(() => {
      expect(promptSpy).toHaveBeenCalled();
      expect(mockSignIn).toHaveBeenCalledWith({}, 'prompted@example.com', window.location.href);
      expect(removeSpy).toHaveBeenCalledWith('emailForSignIn');
      const { toast } = require('react-hot-toast');
      expect(mockSetUser).toHaveBeenCalledWith({ uid: 'u1' });
      expect(toast.success).toHaveBeenCalledWith('Successfully verified and signed in!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
    
    promptSpy.mockRestore();
    removeSpy.mockRestore();
  });

  test('uses stored email and removes it on success', async () => {
    mockIsLink.mockReturnValue(true);
    const removeSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    window.localStorage.setItem('emailForSignIn', 'stored@example.com');
    mockSignIn.mockResolvedValue({ user: { uid: 'u2' } });

    render(<EmailLinkHandler />);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({}, 'stored@example.com', window.location.href);
      expect(removeSpy).toHaveBeenCalledWith('emailForSignIn');
      const { toast } = require('react-hot-toast');
      expect(mockSetUser).toHaveBeenCalledWith({ uid: 'u2' });
      expect(toast.success).toHaveBeenCalledWith('Successfully verified and signed in!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    removeSpy.mockRestore();
  });

  test('handles sign-in errors and preserves email in storage', async () => {
    mockIsLink.mockReturnValue(true);
    window.localStorage.setItem('emailForSignIn', 'e@x.com');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const removeSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    mockSignIn.mockRejectedValue(new Error('fail'));

    render(<EmailLinkHandler />);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
      const { toast } = require('react-hot-toast');
      expect(consoleSpy).toHaveBeenCalledWith('Sign-in failed', expect.anything());
      expect(toast.error).toHaveBeenCalledWith('Verification link invalid or expired.');
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
      expect(removeSpy).not.toHaveBeenCalled();
      expect(window.localStorage.getItem('emailForSignIn')).toBe('e@x.com');
    });

    consoleSpy.mockRestore();
    removeSpy.mockRestore();
  });

  test('handles canceled email prompt', async () => {
    mockIsLink.mockReturnValue(true);
    const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue(null);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignIn.mockRejectedValue(new Error('No email provided'));

    render(<EmailLinkHandler />);

    await waitFor(() => {
      expect(promptSpy).toHaveBeenCalled();
      expect(mockSignIn).toHaveBeenCalledWith({}, null, window.location.href);
      const { toast } = require('react-hot-toast');
      expect(consoleSpy).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Verification link invalid or expired.');
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
      expect(window.localStorage.getItem('emailForSignIn')).toBeNull();
    });

    promptSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  test('handles empty email input', async () => {
    mockIsLink.mockReturnValue(true);
    const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignIn.mockRejectedValue(new Error('Invalid email'));

    render(<EmailLinkHandler />);

    await waitFor(() => {
      expect(promptSpy).toHaveBeenCalled();
      expect(mockSignIn).toHaveBeenCalledWith({}, '', window.location.href);
      const { toast } = require('react-hot-toast');
      expect(consoleSpy).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Verification link invalid or expired.');
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
      expect(window.localStorage.getItem('emailForSignIn')).toBeNull();
    });

    promptSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  test('navigates to dashboard after successful sign-in', async () => {
    mockIsLink.mockReturnValue(true);
    window.localStorage.setItem('emailForSignIn', 'valid@example.com');
    mockSignIn.mockResolvedValue({ user: { uid: 'u1' } });

    render(<EmailLinkHandler />);

    await waitFor(() => {
      const { toast } = require('react-hot-toast');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(toast.success).toHaveBeenCalledWith('Successfully verified and signed in!');
    });
  });

  test('navigates to signin on auth check failure', async () => {
    mockIsLink.mockImplementation(() => {
      throw new Error('Auth check failed');
    });

    render(<EmailLinkHandler />);
    
    await waitFor(() => {
      const { toast } = require('react-hot-toast');
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
      expect(toast.error).toHaveBeenCalledWith('Invalid sign-in link.');
    });
  });

  test('navigates to signin after user context update failure', async () => {
    mockIsLink.mockReturnValue(true);
    window.localStorage.setItem('emailForSignIn', 'valid@example.com');
    mockSignIn.mockResolvedValue({ user: { uid: 'u1' } });
    
    mockSetUser.mockImplementation(() => {
      throw new Error('User context update failed');
    });

    render(<EmailLinkHandler />);

    await waitFor(() => {
      const { toast } = require('react-hot-toast');
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
      expect(toast.error).toHaveBeenCalledWith('Verification link invalid or expired.');
    });
  });
});