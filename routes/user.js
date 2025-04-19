// routes/user.js
const express = require("express");
const admin = require("../modules/firebase"); // Firebase Admin SDK
const verifyToken = require("../modules/verifyToken"); // Firebase token verification middleware

const router = express.Router();

// Route for updating the user profile
router.post("/update-profile", verifyToken, async (req, res) => {
    const { uid } = req.user; // User ID from the decoded Firebase token
    const { email, displayName, password } = req.body;

    try {
        const updateData = {};

        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (displayName) updateData.displayName = displayName;

        await admin.auth().updateUser(uid, updateData);

        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
