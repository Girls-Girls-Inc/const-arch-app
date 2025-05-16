// __tests__/forgotPassword.test.js
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { forgotPassword } from '../authorisation';
import { sendPasswordResetEmail } from 'firebase/auth';

describe('forgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws and toasts an error if email is empty', async () => {
    console.error = jest.fn();
    await expect(forgotPassword('')).rejects.toThrow('Email cannot be empty');
    expect(toast.error).toHaveBeenCalledWith("Please fill in your email :(", {
      duration: 4000,
      position: "top-right",
    });
  });

  it('sends reset email and toasts success on valid email', async () => {
    const email = 'user@example.com';
    await forgotPassword(email);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), email);
    expect(toast.success).toHaveBeenCalledWith("Successfully send email: Check your Inbox!", {
      duration: 4000,
      position: "top-right",
    });
  });

  it('logs error if sendPasswordResetEmail rejects', async () => {
    const error = new Error('Reset failed');
    sendPasswordResetEmail.mockRejectedValueOnce(error);
    console.error = jest.fn();

    await forgotPassword('user@example.com');

    expect(sendPasswordResetEmail).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("Error sending email:", error);
  });
});
