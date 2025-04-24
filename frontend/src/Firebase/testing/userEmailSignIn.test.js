jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  FacebookAuthProvider: jest.fn().mockImplementation(() => ({})),
}));

import { signInWithEmail } from '../authorisation'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

describe('signInWithEmailAndPassword', () => {
  it('should allow an existing user to log in', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'test-user-id', email },
    });

    const user = await signInWithEmail(email, password);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), email, password);
    expect(user).toEqual({ uid: 'test-user-id', email });
  });

  it('should throw an error if email is missing', async () => {
    await expect(signInWithEmail('', 'password123', 'Test User')).rejects.toThrow('Email cannot be empty');
  });

  it('should throw an error if password is missing', async () => {
    await expect(signInWithEmail('test@example.com', '', 'Test User')).rejects.toThrow('Password cannot be empty');
  });
});