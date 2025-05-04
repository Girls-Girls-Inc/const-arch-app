const express = require("express");
const { addUpload, deleteUpload } = require("../controllers/uploadController");

const router = express.Router();

router.post("/upload", addUpload);
router.delete("/uploads/:id", deleteUpload);

module.exports = {
  routes: router,
};
