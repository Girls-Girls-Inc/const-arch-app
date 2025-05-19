import { forgotPassword } from '../authorisation';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  FacebookAuthProvider: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('forgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws and toasts an error if email is empty', async () => {
    console.error = jest.fn();
    const emptyEmail = '';

    await expect(forgotPassword(emptyEmail)).rejects.toThrow('Email cannot be empty');
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

    await expect(forgotPassword('user@example.com')).rejects.toThrow('Reset failed');

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'user@example.com');
    expect(console.error).toHaveBeenCalledWith("Error sending email:", error);
  });
});
