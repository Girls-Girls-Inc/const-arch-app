const express = require("express");
const router = express.Router();

const { admin } = require("../db");
const verifyToken = require("./verifyToken");

router.post("/updateUser", verifyToken, async (req, res) => {
    const { uid } = req.user;
    const { email, displayName, newPassword } = req.body;

    try {
        const updateData = {};
        if (email) updateData.email = email;
        if (newPassword) updateData.password = newPassword;
        if (displayName) updateData.displayName = displayName;

        await admin.auth().updateUser(uid, updateData);

        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router };
