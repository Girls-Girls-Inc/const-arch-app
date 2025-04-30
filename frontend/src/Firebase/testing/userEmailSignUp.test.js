jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  FacebookAuthProvider: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  doc: jest.fn(),
  getFirestore: jest.fn(() => ({})), // Add this to mock getFirestore
}));

// Mock Axios
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ status: 200 })),
}));

import { signUpWithEmail } from '../authorisation'; // Adjust the path as needed
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import axios from 'axios';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('signUpWithEmailAndPassword', () => {
  it('should create a new user and send user data to the backend', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';

    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'test-user-id', email },
    });

    const user = await signUpWithEmail(email, password, name);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), email, password);
    expect(updateProfile).toHaveBeenCalledWith({ uid: 'test-user-id', email }, { displayName: name });
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/api/user"), {
      uid: 'test-user-id',
      email,
    });
    expect(user).toEqual({ uid: 'test-user-id', email });
  });

  it('should not call updateProfile if name is not provided', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'test-user-id', email },
    });

    await signUpWithEmail(email, password);

    expect(updateProfile).not.toHaveBeenCalled();
  });

  it('should throw an error if email is missing', async () => {
    await expect(signUpWithEmail('', 'password123', 'Test User')).rejects.toThrow('Email cannot be empty');
  });

  it('should throw an error if password is missing', async () => {
    await expect(signUpWithEmail('test@example.com', '', 'Test User')).rejects.toThrow('Password cannot be empty');
  });

  it('should call updateProfile if name is provided', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';

    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'test-user-id', email },
    });

    await signUpWithEmail(email, password, name);

    expect(updateProfile).toHaveBeenCalledWith({ uid: 'test-user-id', email }, { displayName: name });
  });
});