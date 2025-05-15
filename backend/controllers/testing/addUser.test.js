const set = jest.fn();
const doc = jest.fn(() => ({ set }));
const collection = jest.fn(() => ({ doc }));
const mockFirestore = jest.fn(() => ({ collection }));

jest.mock('firebase-admin', () => {
  return {
    credential: {
      cert: jest.fn().mockReturnValue({}),
    },
    initializeApp: jest.fn(),
    firestore: mockFirestore,
  };
});

const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const { addUser } = require('../userController');

describe('POST /addUser', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/api/user', addUser); 
  });

  it('should create a new user and send a success response', async () => {
    const user = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      photoURL: '',
    };

    const response = await request(app)
      .post('/api/user')
      .send(user)
      .expect(200);

    expect(response.text).toBe('User added successfully!');
    expect(admin.firestore().collection().doc().set).toHaveBeenCalledWith({
      uid: 'test-user-id',
      name: 'Test User'||'',
      email: 'test@example.com',
      isAdmin: false,
      photoURL: '',
      createdAt: expect.any(String),
      profileComplete: false,
    });
  });

  it('should return 400 if missing required fields', async () => {
    const user = {
      name: 'Test User',
      photoURL: '',
    };

    const response = await request(app)
      .post('/api/user')
      .send(user)
      .expect(400);

    expect(response.text).toBe('Missing required fields: uid and email are required.');
  });

  it('should return 500 if Firebase error occurs', async () => {
    set.mockRejectedValueOnce(new Error('Firebase error'));

    const user = {
      id: 'test-user-id',
      name: '',
      email: 'test@example.com',
      photoURL: '',
    };

    const response = await request(app)
      .post('/api/user')
      .send(user)
      .expect(500);

    expect(response.text).toContain('Error adding user');
  });
});