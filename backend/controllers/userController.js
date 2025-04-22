'use strict';

const { db } = require('../db'); // destructure the db property


const addUser = async (req, res) => {
    try {
        const user = req.body;
        const data = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email,
            isAdmin: false,
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
            profileComplete: false,
        };

        if (data.uid && data.name && data.email && data.photoURL && data.createdAt) {
            data.profileComplete = true;
        }

        await db.collection('users').doc(user.uid).set(data);
        res.status(200).send('User added successfully!');
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).send('Error adding user: ' + error.message);
    }
};

const updateUser = async (req, res) => {
    const { uid } = req.user; // from verifyToken
    const { email, displayName, password } = req.body;

    try {
        const updateData = {};
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (displayName) updateData.displayName = displayName;

        await db.auth().updateUser(uid, updateData);
        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addUser,
    updateUser
};
