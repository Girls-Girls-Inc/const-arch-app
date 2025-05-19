const express = require("express");
const {
  addUpload,
  deleteUpload,
  handleSearch,
} = require("../controllers/uploadController");

const router = express.Router();

router.post("/upload", addUpload);
router.delete("/uploads/:id", deleteUpload);
router.get("/upload", handleSearch);

module.exports = {
  routes: router,
};
