const request = require('supertest');
const express = require('express');
const { addUser, updateUser, replaceUser, deleteUser } = require('../userController');
const { db } = require('../../db');

const mockSet = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockGet = jest.fn(() => Promise.resolve({ exists: true }));

const mockDoc = jest.fn(() => ({
  set: mockSet,
  update: mockUpdate,
  delete: mockDelete,
  get: mockGet,
}));

const mockCollection = jest.fn(() => ({
  doc: mockDoc,
}));

jest.mock('../../db', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(() => ({ exists: true })),
      })),
    })),
  },
}));


describe('User Controller', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    db.collection.mockImplementation(mockCollection);

    app = express();
    app.use(express.json());
    app.post('/api/user', addUser);
    app.patch('/api/user/:id', updateUser);
    app.put('/api/user/:id', replaceUser);
    app.delete('/api/user/:id', deleteUser);
  });

  describe('POST /api/user', () => {
    it('should create a new user', async () => {
      const user = {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
        photoURL: '',
      };

      const response = await request(app).post('/api/user').send(user);
      expect(response.status).toBe(200);
      expect(mockSet).toHaveBeenCalled();
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app).post('/api/user').send({ name: 'No ID' });
      expect(response.status).toBe(400);
    });

    it('should return 500 on Firestore error', async () => {
      mockSet.mockRejectedValueOnce(new Error('Firestore error'));
      const response = await request(app).post('/api/user').send({
        id: 'test-id',
        email: 'test@example.com',
      });
      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /api/user/:id', () => {
    it('should update an existing user', async () => {
      const response = await request(app).patch('/api/user/test-id').send({ name: 'Updated' });
      expect(response.status).toBe(200);
      expect(mockUpdate).toHaveBeenCalledWith({ name: 'Updated' });
    });

    it('should return 400 if update data is undefined', async () => {
      const req = { params: { id: 'test-id' }, body: undefined };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('User ID and update data are required.');
    });

    it('should return 400 if update data is null', async () => {
      const req = { params: { id: 'test-id' }, body: null };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('User ID and update data are required.');
    });

    it('should return 404 if user not found', async () => {
      mockGet.mockResolvedValueOnce({ exists: false });
      const response = await request(app).patch('/api/user/test-id').send({ name: 'X' });
      expect(response.status).toBe(404);
    });

    it('should handle Firestore update errors', async () => {
      mockUpdate.mockRejectedValueOnce(new Error('Update error'));
      const response = await request(app).patch('/api/user/test-id').send({ name: 'X' });
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/user/:id', () => {
    it('should replace an existing user', async () => {
      const userData = {
        name: 'New Name',
        email: 'new@example.com',
        isAdmin: true,
        photoURL: '',
        createdAt: '2023-01-01T00:00:00Z',
      };

      const response = await request(app).put('/api/user/test-id').send(userData);
      expect(response.status).toBe(200);
      expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ uid: 'test-id' }), { merge: false });
    });

    it('should return 400 if data is missing', async () => {
      const response = await request(app).put('/api/user/test-id').send({ name: 'No email' });
      expect(response.status).toBe(400);
    });

    it('should return 500 on error', async () => {
      mockSet.mockRejectedValueOnce(new Error('Replace error'));
      const response = await request(app).put('/api/user/test-id').send({
        email: 'replace@example.com',
      });
      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete a user', async () => {
      const response = await request(app).delete('/api/user/test-id');
      expect(response.status).toBe(200);
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should return 400 if user ID is missing', async () => {
      const req = { params: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('User ID is required.');
    });

    it('should return 500 on error', async () => {
      mockDelete.mockRejectedValueOnce(new Error('Delete error'));
      const response = await request(app).delete('/api/user/test-id');
      expect(response.status).toBe(500);
    });
  });
});
