jest.mock('../Firebase/firebase', () => ({
  auth: {},
  googleProvider: {},
  db: {},
  storage: {},
}));

process.env.VITE_API_HOST_URL = 'http://localhost';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from '../pages/settings';
import { useUser } from '../context/userContext';
import { toast, Toaster } from 'react-hot-toast';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ currentUser: { uid: 'user1', displayName: 'OldName', email: 'old@example.com', reload: jest.fn() } })),
  updateProfile: jest.fn(),
}));
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

global.fetch = jest.fn();

jest.mock('../context/userContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('react-hot-toast', () => {
  const mockToastFn = jest.fn();
  mockToastFn.success = jest.fn();
  mockToastFn.error = jest.fn();
  mockToastFn.dismiss = jest.fn();

  return {
    toast: mockToastFn,
    Toaster: () => <div data-testid="toaster" />,
  };
});

describe('SettingsPage Component', () => {
  const mockUser = {
    uid: 'user1',
    displayName: 'OldName',
    email: 'old@example.com',
    getIdToken: jest.fn().mockResolvedValue('token123'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({ user: mockUser, loading: false, setUser: jest.fn() });
  });

  const renderWithRouter = () => render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  );

  it('renders form fields with current user data', () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText(/Enter username/i)).toHaveValue('OldName');
    expect(screen.getByPlaceholderText(/Enter email/i)).toHaveValue('old@example.com');
  });

  it('shows error when setting new password without current password', async () => {
    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/New password/i), { target: { value: 'newpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter your current password to set a new one.');
    });
  });

  it('shows info toast when no changes made', async () => {
    renderWithRouter();
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('No changes to save.', expect.objectContaining({ icon: 'ℹ️' }));
    });
  });

  it('submits updated displayName and updates Firebase profile', async () => {
    fetch.mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify({}) });
    const { updateProfile } = require('firebase/auth');

    renderWithRouter();
    const nameInput = screen.getByPlaceholderText(/Enter username/i);
    fireEvent.change(nameInput, { target: { value: 'NewName' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      `${process.env.VITE_API_HOST_URL}/api/user/user1`,
      expect.objectContaining({ method: 'PATCH' })
    ));
    expect(updateProfile).toHaveBeenCalledWith(expect.any(Object), { displayName: 'NewName' });
    expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
  });
});