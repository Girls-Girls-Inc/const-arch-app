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
  it('calls signInWithPopup and sends user data to backend', async () => {
    const fakeProvider = {};

    const user = await withProvider(fakeProvider);

    // Verify that signInWithPopup is called with the correct provider
    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), fakeProvider);
    
    // Ensure Firestore's getDoc function was called to check if the user exists
    expect(getDoc).toHaveBeenCalled();
    
    // Ensure the axios POST request is sent with the correct user data
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/api/user"), {
      id: 'test-user-id',
      email: 'test@example.com',
      name: expect.any(String),
      photoURL: ""
    });

    // Ensure the returned user matches the expected result
    expect(user).toEqual({ uid: 'test-user-id', email: 'test@example.com' });
  });
});