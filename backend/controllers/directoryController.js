"use strict";

const { db } = require("../db");
//const Directory = require("../models/directory");

// Add Directory
const addDirectory = async (req, res, next) => {
  try {
    const data = req.body;

    // Validate required fields (excluding id)
    if (!data || !data.name || !data.createdBy || !data.createdAt) {
      return res
        .status(400)
        .send("Missing required fields: name, createdBy, createdAt");
    }

    // Generate Firestore document reference (with unique ID)
    const docRef = db.collection("directory").doc();

    // Build the directory object
    const directory = {
      id: docRef.id,
      name: data.name,
      parentId: data.parentId || null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
    };

    // Save to Firestore
    await docRef.set(directory);

    res.status(200).send({
      message: "Directory saved successfully!",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error saving directory:", error.message);
    res.status(500).send("Error saving directory: " + error.message);
  }
};

// Delete Directory
const deleteDirectory = async (req, res, next) => {
  try {
    const directoryId = req.params.id;
    if (!directoryId) {
      return res.status(400).send("Directory ID is required.");
    }

    await db.collection("directory").doc(directoryId).delete();
    res
      .status(200)
      .send(`Directory with ID ${directoryId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting directory:", error.message);
    res.status(500).send("Error deleting directory: " + error.message);
  }
};

module.exports = {
  addDirectory,
  deleteDirectory,
};
