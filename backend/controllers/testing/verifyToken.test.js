// backend/controllers/testing/verifyToken.test.js
const verifyToken = require('../verifyToken');
const { admin } = require('../../db');

let mockVerifyIdToken;

// Mock the db admin.auth().verifyIdToken behavior
jest.mock('../../db', () => {
  mockVerifyIdToken = jest.fn();
  return {
    admin: {
      auth: () => ({ verifyIdToken: mockVerifyIdToken }),
    },
  };
});

describe('verifyToken middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('returns 401 if no Authorization header', async () => {
    await verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 if header does not start with Bearer', async () => {
    req.headers.authorization = 'Token abc';
    await verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 on invalid token', async () => {
    req.headers.authorization = 'Bearer invalid_token';
    mockVerifyIdToken.mockRejectedValueOnce(new Error('Invalid token'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await verifyToken(req, res, next);
    expect(mockVerifyIdToken).toHaveBeenCalledWith('invalid_token');
    expect(consoleSpy).toHaveBeenCalledWith('Token verification failed:', expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - Invalid token' });
    expect(next).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('calls next and attaches req.user on valid token', async () => {
    const decoded = { uid: 'user123' };
    req.headers.authorization = 'Bearer valid_token';
    mockVerifyIdToken.mockResolvedValueOnce(decoded);

    await verifyToken(req, res, next);
    expect(mockVerifyIdToken).toHaveBeenCalledWith('valid_token');
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
