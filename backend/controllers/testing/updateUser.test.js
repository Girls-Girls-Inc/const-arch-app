const mockUpdateUser = jest.fn();

jest.mock('firebase-admin', () => {
  return {
    credential: {
      cert: jest.fn().mockReturnValue({}),
    },
    initializeApp: jest.fn(),
    auth: jest.fn(() => ({
      updateUser: mockUpdateUser,
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          set: jest.fn(),
        })),
      })),
    })),
  };
});

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const express = require('express');
const request = require('supertest');
const admin = require('firebase-admin');
const { updateUser } = require('../userController');

describe('POST /api/user', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Mocking the req.user object in the request to simulate authentication
    app.use((req, res, next) => {
      req.user = { uid: 'test-uid' }; // Mocked user
      next();
    });

    // Using POST route for user update
    app.post('/api/user', updateUser);
  });

  beforeEach(() => {
    jest.clearAllMocks();  // Ensure mocks are reset between tests
  });

  it('should update user profile and return success message', async () => {
    const userData = {
      email: 'new@example.com',
      displayName: 'New Name',
    };

    // Mock successful user update
    mockUpdateUser.mockResolvedValueOnce({});

    const response = await request(app)
      .post('/api/user')
      .send(userData)
      .expect(200);

    expect(mockUpdateUser).toHaveBeenCalledWith('test-uid', {
      email: 'new@example.com',
      displayName: 'New Name',
    });
    expect(response.body).toEqual({ message: 'Profile updated successfully!' });
  });
  
  mockUpdateUser.mockResolvedValueOnce({});

  it('should return 500 if updateUser throws an error', async () => {
    // Mock update failure
    mockUpdateUser.mockRejectedValueOnce(new Error('Something went wrong'));

    const response = await request(app)
      .post('/api/user')
      .send({ email: 'oops@example.com' })
      .expect(500);

    expect(response.body.error).toBe('Something went wrong');
  });
});