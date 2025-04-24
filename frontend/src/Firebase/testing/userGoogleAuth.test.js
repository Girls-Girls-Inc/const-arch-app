
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

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ status: 200 })),
}));

import { withProvider } from '../authorisation';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

describe('withProvider', () => {
  it('calls signInWithPopup and sends user data to backend', async () => {
    const fakeProvider = {};

    const user = await withProvider(fakeProvider);

    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), fakeProvider);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/api/user', {
      uid: 'test-user-id',
      email: 'test@example.com',
    });
    expect(user).toEqual({ uid: 'test-user-id', email: 'test@example.com' });
  });
});