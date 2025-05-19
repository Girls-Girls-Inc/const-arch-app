// backend/controllers/testing/directoryController.test.js

const request = require('supertest');
const express = require('express');
const { addDirectory, deleteDirectory } = require('../directoryController');
const { db } = require('../../db');

// Mock the db.collection().doc() behavior
jest.mock('../../db', () => ({
  db: {
    collection: jest.fn(),
  }
}));

describe('directoryController', () => {
  let app;
  let mockSet;
  let mockDelete;
  let mockDoc;
  let mockCollection;

  beforeEach(() => {
    jest.clearAllMocks();

    // create fresh mocks
    mockSet = jest.fn().mockResolvedValue(undefined);
    mockDelete = jest.fn().mockResolvedValue(undefined);
    mockDoc = jest.fn(() => ({ id: 'generated-id', set: mockSet, delete: mockDelete }));
    mockCollection = jest.fn(() => ({ doc: mockDoc }));

    // wire up the db mock
    db.collection.mockImplementation(mockCollection);

    // express app setup
    app = express();
    app.use(express.json());
    app.post('/directory', addDirectory);
    app.delete('/directory/:id', deleteDirectory);
  });

  describe('POST /directory (addDirectory)', () => {
    it('should save directory and return id and message', async () => {
      const payload = {
        name: 'My Folder',
        parentId: 'parent123',
        createdBy: 'userA',
        createdAt: '2025-05-16T12:00:00Z'
      };

      const res = await request(app).post('/directory').send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Directory saved successfully!', id: 'generated-id' });
      expect(db.collection).toHaveBeenCalledWith('directory');
      expect(mockDoc).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith({
        id: 'generated-id',
        name: 'My Folder',
        parentId: 'parent123',
        createdBy: 'userA',
        createdAt: '2025-05-16T12:00:00Z'
      });
    });

    it('should default parentId to null if not provided', async () => {
      const payload = {
        name: 'Root Folder',
        createdBy: 'userB',
        createdAt: '2025-05-16T13:00:00Z'
      };

      const res = await request(app).post('/directory').send(payload);

      expect(res.status).toBe(200);
      expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ parentId: null }));
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/directory').send({ name: 'Incomplete' });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Missing required fields: name, createdBy, createdAt');
    });

    it('should return 500 on Firestore error', async () => {
      mockDoc.mockReturnValueOnce({ id: 'x', set: jest.fn().mockRejectedValueOnce(new Error('Save fail')) });
      const payload = {
        name: 'ErrFolder',
        createdBy: 'userC',
        createdAt: '2025-05-16T14:00:00Z'
      };

      const res = await request(app).post('/directory').send(payload);
      expect(res.status).toBe(500);
      expect(res.text).toContain('Error saving directory: Save fail');
    });
  });

  describe('DELETE /directory/:id (deleteDirectory)', () => {
    it('should delete directory when ID is provided', async () => {
      const res = await request(app).delete('/directory/dir123');

      expect(res.status).toBe(200);
      expect(res.text).toBe('Directory with ID dir123 deleted successfully.');
      expect(db.collection).toHaveBeenCalledWith('directory');
      expect(mockDoc).toHaveBeenCalledWith('dir123');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should return 400 if directory ID is missing', async () => {
      const req = { params: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await deleteDirectory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Directory ID is required.');
    });

    it('should return 500 on deletion error', async () => {
      mockDelete.mockRejectedValueOnce(new Error('Delete fail'));
      const res = await request(app).delete('/directory/dir789');

      expect(res.status).toBe(500);
      expect(res.text).toContain('Error deleting directory: Delete fail');
    });
  });
});
