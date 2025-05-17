// backend/controllers/testing/verifyToken.test.js

const express = require('express');
const request = require('supertest');

// Declare mock function before jest.mock
let mockVerifyIdToken;

// 1) Mock the same "../../db" module used in verifyToken.js
jest.mock('../../db', () => {
  mockVerifyIdToken = jest.fn();
  return {
    admin: {
      auth: () => ({ verifyIdToken: mockVerifyIdToken }),
    },
  };
});

// 2) Import the middleware under test
const verifyToken = require('../verifyToken');

// 3) Create a minimal express app to test the middleware
function createApp() {
  const app = express();
  app.use(express.json());
  // Protected route
  app.get('/protected', verifyToken, (req, res) => {
    // Middleware assigns req.user
    res.status(200).json({ user: req.user });
  });
  return app;
}

describe('verifyToken middleware', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no Authorization header', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized - No token provided' });
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header malformed', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'BadHeader token');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized - No token provided' });
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('should return 401 if token verification fails', async () => {
    mockVerifyIdToken.mockRejectedValueOnce(new Error('Invalid token'));

    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer bad_token');

    expect(mockVerifyIdToken).toHaveBeenCalledWith('bad_token');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized - Invalid token' });
  });

  it('should call next and attach req.user on valid token', async () => {
    const fakePayload = { uid: 'user123', email: 'x@y.com' };
    mockVerifyIdToken.mockResolvedValueOnce(fakePayload);

    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer good_token');

    expect(mockVerifyIdToken).toHaveBeenCalledWith('good_token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: fakePayload });
  });
});
