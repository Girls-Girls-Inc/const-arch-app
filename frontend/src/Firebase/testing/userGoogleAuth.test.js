jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(() =>
    Promise.resolve({
      user: { uid: 'test-user-id', email: 'test@example.com' },
    })
  ),
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  FacebookAuthProvider: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})), // Mock the getFirestore function
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => false, // Simulate that the user doc does NOT exist
    })
  ),
  doc: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ status: 200 })), // Mock the axios POST request
}));

import { withProvider } from '../authorisation';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { getDoc, doc } from 'firebase/firestore';

describe('withProvider', () => {
  const fakeProvider = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls signInWithPopup and sends user data to backend when user doc does NOT exist', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    const user = await withProvider(fakeProvider);

    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), fakeProvider);
    expect(getDoc).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/api/user"), {
      id: 'test-user-id',
      email: 'test@example.com',
      name: expect.any(String),
      photoURL: ""
    });
    expect(user).toEqual({ uid: 'test-user-id', email: 'test@example.com' });
  });

  it('does not call backend if user doc already exists', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true });

    const user = await withProvider(fakeProvider);

    expect(signInWithPopup).toHaveBeenCalled();
    expect(getDoc).toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
    expect(user.uid).toBe('test-user-id');
  });

  it('throws if no user is returned from provider', async () => {
    signInWithPopup.mockResolvedValueOnce({}); // no user
    await expect(withProvider(fakeProvider))
      .rejects
      .toThrow('No user returned from provider.');
  });

  it('logs an error if backend sync fails for new OAuth user', async () => {
    // simulate new user doc, then a failed axios.post
    getDoc.mockResolvedValueOnce({ exists: () => false });
    const error = new Error('Sync fail');
    axios.post.mockRejectedValueOnce(error);
    console.error = jest.fn();

    const user = await withProvider(fakeProvider);

    expect(console.error).toHaveBeenCalledWith(
      "Error syncing OAuth user:",
      error.message
    );
    // still returns the user even if sync fails
    expect(user).toEqual({ uid: 'test-user-id', email: 'test@example.com' });
  });
});