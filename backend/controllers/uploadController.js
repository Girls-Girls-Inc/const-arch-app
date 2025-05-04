"use strict";

const { db } = require("../db");
const Upload = require("../models/upload");

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

module.exports = {
  addUpload,
  deleteUpload,
};
