// backend/controllers/testing/uploadController.test.js

const request = require('supertest');
const express = require('express');
const {
  addUpload,
  deleteUpload,
  handleSearch,
} = require('../uploadController');
const { db } = require('../../db');

jest.mock('../../db', () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe('uploadController', () => {
  let app;
  let mockSet;
  let mockDelete;
  let mockGet;
  let mockDoc;
  let mockCollection;

  beforeEach(() => {
    jest.clearAllMocks();

    // create fresh mocks for each test
    mockSet = jest.fn().mockResolvedValue(undefined);
    mockDelete = jest.fn().mockResolvedValue(undefined);
    mockGet = jest.fn();

    mockDoc = jest.fn(() => ({
      set: mockSet,
      delete: mockDelete,
    }));

    mockCollection = jest.fn(() => ({
      doc: mockDoc,
      get: mockGet,
    }));

    db.collection.mockImplementation(mockCollection);

    // create an Express app with our routes
    app = express();
    app.use(express.json());
    app.post('/upload', addUpload);
    app.delete('/upload/:id', deleteUpload);
    app.get('/upload', handleSearch);
  });

  // --- addUpload ---
  describe('POST /upload (addUpload)', () => {
    it('responds with success message on successful upload', async () => {
      const payload = { title: 'Test Upload', content: 'Data' };

      const res = await request(app).post('/upload').send(payload);

      expect(res.status).toBe(200);
      expect(res.text).toBe('Upload saved successfully!');
      expect(db.collection).toHaveBeenCalledWith('upload');
      expect(mockDoc).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith(payload);
    });

    it('handles Firestore error and returns 400', async () => {
      mockCollection.mockImplementationOnce(() => { throw new Error('Firestore error'); });

      const res = await request(app).post('/upload').send({ title: 'X' });

      expect(res.status).toBe(400);
      expect(res.text).toBe('Firestore error');
    });
  });

  // --- deleteUpload ---
  describe('DELETE /upload/:id (deleteUpload)', () => {
    it('deletes when ID is provided', async () => {
      const res = await request(app).delete('/upload/abc123');

      expect(res.status).toBe(200);
      expect(res.text).toBe('Upload with ID abc123 deleted successfully.');
      expect(db.collection).toHaveBeenCalledWith('upload');
      expect(mockDoc).toHaveBeenCalledWith('abc123');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('returns 400 if no ID is provided', async () => {
      // call controller directly to hit the `if (!uploadId)` branch
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await deleteUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Upload ID is required.');
    });

    it('handles deletion error and returns 400', async () => {
      mockDelete.mockRejectedValueOnce(new Error('Delete failed'));

      const res = await request(app).delete('/upload/xyz789');

      expect(res.status).toBe(400);
      expect(res.text).toBe('Delete failed');
    });
  });

  // --- handleSearch ---
  describe('GET /upload?fileName=… (handleSearch)', () => {
    const sampleDocs = [
      { id: '1', data: () => ({ fileName: 'Report.pdf', tags: ['annual'] }) },
      { id: '2', data: () => ({ fileName: 'Summary.txt', tags: ['summary', 'report'] }) },
      { id: '3', data: () => ({ fileName: 'Notes.doc', tags: [] }) },
    ];

    it('returns 400 if fileName query param is missing', async () => {
      const res = await request(app).get('/upload');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'fileName query parameter is required' });
    });

    it('returns filtered results when query matches fileName or tags', async () => {
      mockGet.mockResolvedValueOnce({ docs: sampleDocs });

      const res = await request(app).get('/upload').query({ fileName: 'report' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('results');
      // Should match doc 1 (filename) and doc 2 (tag)
      const ids = res.body.results.map(d => d.id).sort();
      expect(ids).toEqual(['1', '2']);
    });

    it('returns empty results when none match', async () => {
      mockGet.mockResolvedValueOnce({ docs: sampleDocs });

      const res = await request(app).get('/upload').query({ fileName: 'xyz' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ results: [] });
    });

    it('handles Firestore get errors and returns 500', async () => {
      mockGet.mockRejectedValueOnce(new Error('Search failed'));

      const res = await request(app).get('/upload').query({ fileName: 'any' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Search failed' });
    });
  });
});
