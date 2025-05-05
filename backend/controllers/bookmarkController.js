"use strict";

const { db } = require("../db");
const Bookmark = require("../models/bookmark");

const addBookmark = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    const data = req.body;
    console.log("Firestore DB object:", db);

    console.log("Received data:", data);
    await db.collection("bookmark").doc().set(data);
    res.send("Bookmark saved successfully!");
  } catch (error) {
    console.error("Error saving upload:", error.message);
    res.status(400).send(error.message);
  }
};

const removeBookmark = async (req, res, next) => {
  try {
    const bookmarkId = req.params.id;
    if (!bookmarkId) {
      return res.status(400).send("Bookmark ID is required.");
    }
    await db.collection("bookmark").doc(bookmarkId).delete();
    res.send(`Bookmark with ID ${bookmarkId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting bookmark:", error.message);
    res.status(400).send(error.message);
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
};
