jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({})),
    signOut: jest.fn(() => Promise.resolve()),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
    FacebookAuthProvider: jest.fn().mockImplementation(() => ({})),
  }));

jest.mock('firebase/firestore', () => ({
    getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
    doc: jest.fn(),
    getFirestore: jest.fn(() => ({})), // Add this to mock getFirestore
  }));


jest.mock('react-hot-toast', () => ({
    toast: {
      success: jest.fn(),
    },
}));

process.env.VITE_API_HOST_URL = 'https://mocked-api-url.com';

global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

import { handleLogout } from "../authorisation.js";
import { signOut } from "firebase/auth";
import { toast } from 'react-hot-toast';

describe('handleLogout', () => {
  let setUser, navigate;

  beforeEach(() => {
    setUser = jest.fn();
    navigate = jest.fn();
    jest.clearAllMocks();
  });
  
  it('signs out the user and updates state', async () => {
      const setUser = jest.fn();

      await handleLogout(setUser);

      expect(signOut).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith(null);
      expect(toast.success).toHaveBeenCalledWith("Successfully signed out", {
        duration: 4000,
        position: "top-right",
      });
      expect(navigate).toHaveBeenCalledWith("/");
  });

  it('handles signOut errors gracefully', async () => {
      const setUser = jest.fn();
      const error = new Error('Sign out failed');
      signOut.mockRejectedValueOnce(error);
      console.error = jest.fn();
  
      await handleLogout(setUser);
  
      expect(console.error).toHaveBeenCalledWith("Error signing out:", error);
      expect(navigate).not.toHaveBeenCalled();
  });
});  