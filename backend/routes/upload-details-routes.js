const express = require('express');
const { updateUploadDetails, getUploadDetails } = require('../controllers/uploadDetails'); // Import both functions
const verifyToken = require('../controllers/verifyToken'); // Import the verifyToken middleware

const router = express.Router();

// Define the PATCH route for updating upload details
router.patch("/uploadRecord/:id", verifyToken, updateUploadDetails);

// Define the GET route for retrieving upload details
router.get("/uploadRecord/:id", verifyToken, getUploadDetails);

module.exports = {
    routes: router
};
