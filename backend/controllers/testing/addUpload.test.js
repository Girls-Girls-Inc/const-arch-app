const request = require('supertest');
const express = require('express');
const { addUpload } = require('../uploadController');


const app = express();
app.use(express.json());
app.post('/upload', addUpload);

jest.mock('../../db', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn().mockResolvedValue(undefined)
      }))
    }))
  }
}));

describe('POST /upload', () => {
  it('should respond with success message on successful upload', async () => {
    const response = await request(app)
      .post('/upload')
      .send({ title: 'Test Upload', content: 'Some data' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Upload saved successfully!');
  });

  it('should handle errors and return 400 status', async () => {
    const { db } = require('../../db');
    db.collection.mockImplementationOnce(() => {
      throw new Error('Firestore error');
    });

    const response = await request(app)
      .post('/upload')
      .send({ title: 'Broken Upload' });

    expect(response.statusCode).toBe(400);
    expect(response.text).toContain('Firestore error');
  });
});