
import { signUpWithEmail } from '../authorisation';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import axios from 'axios';
import { toast } from "react-hot-toast";

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  updateProfile: jest.fn(),
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  FacebookAuthProvider: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  doc: jest.fn(),
  getFirestore: jest.fn(() => ({})),

}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}))

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ status: 200 })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('signUpWithEmail', () => {
  it('should create a new user and send user data to the backend', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';

    const mockUser = {
      uid: 'test-user-id',
      email,
      displayName: name,
      photoURL: '',
    };

    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

    const user = await signUpWithEmail(email, password, name);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), email, password);
    expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: name });
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/api/user"), {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      photoURL: '',
    });
    expect(user).toEqual(mockUser);
  });

  it('should send email to verify the email and call success toast', async () => {
    const email = 'verify@example.com';
    const password = 'password456';
    const name = 'Verify User';

    const mockUser = {
      uid: 'verify-user-id',
      email,
      displayName: name,
      photoURL: '',
    };

    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    sendEmailVerification.mockResolvedValueOnce();

    const { toast } = require('react-hot-toast');

    await signUpWithEmail(email, password, name);

    expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
    expect(toast.success).toHaveBeenCalledWith("Verification email sent. Please check your inbox.");
  });

  it('should not call updateProfile if name is not provided', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const mockUser = {
      uid: 'test-user-id',
      email,
      displayName: '',
      photoURL: '',
    };

    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

    await signUpWithEmail(email, password);

    expect(updateProfile).not.toHaveBeenCalled();
  });

  it('should throw an error if email is missing', async () => {
    await expect(signUpWithEmail('', 'password123', 'Test User')).rejects.toThrow('Email cannot be empty');
  });

  it('should throw an error if password is missing', async () => {
    await expect(signUpWithEmail('test@example.com', '', 'Test User')).rejects.toThrow('Password cannot be empty');
  });
});