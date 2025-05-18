// frontend/src/tests/manageUsers.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useUser } from '../context/userContext';
import ManageUsers from '../pages/manageUsers';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Mock Firebase services
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'test-uid' }
  })),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../Firebase/firebase', () => ({
  db: {}
}));

// Mock other dependencies
jest.mock('../context/userContext');
jest.mock('react-router-dom');
jest.mock('react-hot-toast');

const mockUsers = [
  { id: '1', email: 'admin@test.com', isAdmin: true },
  { id: '2', email: 'user@test.com', isAdmin: false }
];

describe('ManageUsers Component', () => {
  const mockNavigate = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    getAuth.mockClear();

    // Reset all Firestore mocks
    updateDoc.mockClear();
    
    // Mock Firestore responses
    getDocs.mockResolvedValue({
      docs: mockUsers.map(user => ({
        id: user.id,
        data: () => user
      }))
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches users when user is admin', async () => {
    useUser.mockReturnValue({ 
      user: { uid: '1' }, 
      loading: false, 
      isAdmin: true,
      setUser: mockSetUser
    });

    render(<ManageUsers />);
    
    await waitFor(() => {
      expect(getDocs).toHaveBeenCalledWith(collection({}, 'users'));
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    });
  });

  test('shows loading state properly', async () => {
    useUser.mockReturnValue({ 
      user: { uid: '1' }, 
      loading: true, 
      isAdmin: true 
    });

    render(<ManageUsers />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('handles empty users list', async () => {
    useUser.mockReturnValue({ 
      user: { uid: '1' }, 
      loading: false, 
      isAdmin: true 
    });

    getDocs.mockResolvedValue({ docs: [] });

    render(<ManageUsers />);
    
    await waitFor(() => {
      expect(screen.getByText(/No users found/)).toBeInTheDocument();
    });
  });

  test('updates admin status and UI', async () => {
    useUser.mockReturnValue({ 
      user: { uid: '1' }, 
      loading: false, 
      isAdmin: true 
    });

    render(
      <React.Fragment>
        <Toaster />
        <ManageUsers />
      </React.Fragment>
    );

    await waitFor(() => {
      const switches = screen.getAllByRole('checkbox');
      expect(switches[0]).toBeChecked();
      expect(switches[1]).not.toBeChecked();
    });

    const userSwitch = screen.getAllByRole('checkbox')[1];
    fireEvent.click(userSwitch);

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        doc(db, 'users', '2'),
        { isAdmin: true }
      );
      expect(userSwitch).toBeChecked();
    });
  });

  test('shows error toast when fetch fails', async () => {
    useUser.mockReturnValue({ 
      user: { uid: '1' }, 
      loading: false, 
      isAdmin: true 
    });

    getDocs.mockRejectedValue(new Error('Firestore error'));

    render(
      <React.Fragment>
        <Toaster />
        <ManageUsers />
      </React.Fragment>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch user data/)).toBeInTheDocument();
    });
  });

  test('shows error toast when toggle fails', async () => {
    useUser.mockReturnValue({ 
      user: { uid: '1' }, 
      loading: false, 
      isAdmin: true 
    });

    updateDoc.mockRejectedValue(new Error('Update failed'));

    render(
      <React.Fragment>
        <Toaster />
        <ManageUsers />
      </React.Fragment>
    );

    await waitFor(() => {
      const switches = screen.getAllByRole('checkbox');
      fireEvent.click(switches[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to update admin status/)).toBeInTheDocument();
    });
  });

  test('redirects non-admin users', async () => {
    useUser.mockReturnValue({ 
      user: { uid: '2' }, 
      loading: false, 
      isAdmin: false 
    });

    render(<ManageUsers />);
    
    await waitFor(() => {
      expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('handleAdminToggle Functionality', () => {
    test('successfully grants admin privileges', async () => {
      useUser.mockReturnValue({ 
        user: { uid: '1' }, 
        loading: false, 
        isAdmin: true 
      });

      render(
        <React.Fragment>
          <Toaster />
          <ManageUsers />
        </React.Fragment>
      );

      await waitFor(() => {
        const switches = screen.getAllByRole('checkbox');
        fireEvent.click(switches[1]);
      });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { isAdmin: true }
      );

      await waitFor(() => {
        expect(screen.getAllByRole('checkbox')[1]).toBeChecked();
      });

      expect(screen.getByText(/User is now an admin/)).toBeInTheDocument();
    });

    test('successfully revokes admin privileges', async () => {
      useUser.mockReturnValue({ 
        user: { uid: '1' }, 
        loading: false, 
        isAdmin: true 
      });

      render(
        <React.Fragment>
          <Toaster />
          <ManageUsers />
        </React.Fragment>
      );

      await waitFor(() => {
        const switches = screen.getAllByRole('checkbox');
        fireEvent.click(switches[0]);
      });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { isAdmin: false }
      );

      await waitFor(() => {
        expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();
      });

      expect(screen.getByText(/User is now not an admin/)).toBeInTheDocument();
    });

    test('shows error toast on update failure', async () => {
      useUser.mockReturnValue({ 
        user: { uid: '1' }, 
        loading: false, 
        isAdmin: true 
      });

      updateDoc.mockRejectedValueOnce(new Error('Permission denied'));

      render(
        <React.Fragment>
          <Toaster />
          <ManageUsers />
        </React.Fragment>
      );

      await waitFor(() => {
        const switches = screen.getAllByRole('checkbox');
        fireEvent.click(switches[0]);
      });

      await waitFor(() => {
        expect(screen.getByText(/Failed to update admin status/)).toBeInTheDocument();
      });

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
    });
  });
});