"use strict";

const { db } = require("../db");
//const Upload = require("../models/upload");
//const searchRoutes = require("../routes/search-routes");
const admin = require('firebase-admin');

const addUpload = async (req, res, next) => {
  try {
    const data = req.body;
    await db.collection("upload").doc().set(data);
    res.send("Upload saved successfully!");
  } catch (error) {
    console.error("Error saving upload:", error.message);
    res.status(400).send(error.message);
  }
};

const deleteUpload = async (req, res, next) => {
  try {
    const uploadId = req.params.id;
    if (!uploadId) {
      return res.status(400).send("Upload ID is required.");
    }
    await db.collection("upload").doc(uploadId).delete();
    res.send(`Upload with ID ${uploadId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting upload:", error.message);
    res.status(400).send(error.message);
  }
};

const handleSearch = async (req, res) => {
  try {
    const query = req.query.fileName;

    if (!query) {
      return res.status(400).json({ error: 'fileName query parameter is required' });
    }

    const snapshot = await db.collection('upload').get();

    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const results = documents.filter(doc =>
      doc.fileName?.toLowerCase().includes(query.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    res.status(200).json({ results });

  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
};

module.exports = {
  addUpload,
  deleteUpload,
  handleSearch
};
