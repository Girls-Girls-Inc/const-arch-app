// routes/user-routes.js
const express = require("express");
const { addUser, updateUser } = require("../controllers/userController");
const verifyToken = require("../controllers/verifyToken");

const router = express.Router();

// Define routes
router.post("/addUser", addUser);
router.post("/updateUser", verifyToken, updateUser);

// Export the router correctly
module.exports = router;
