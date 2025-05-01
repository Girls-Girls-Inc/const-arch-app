'use strict';

const { db } = require('../db');

const addUser = async (req, res) => {
    try {
        const user = req.body;
        const data = {
            uid: user.id,
            name: user.name || "",
            email: user.email,
            isAdmin: false,
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
            profileComplete: false,
        };
        
        const requiredFields = [data.uid, data.email];
        if (!requiredFields.every(Boolean)) {
            return res.status(400).send('Missing required fields: uid and email are required.');
        }

        const allFields = [data.uid, data.isAdmin, data.email, data.name, data.photoURL, data.createdAt];
        data.profileComplete = allFields.every(Boolean);

        await db.collection('users').doc(data.uid).set(data);
        res.status(200).send('User added successfully!');
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).send('Error adding user: ' + error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).send('User ID is required.');
        }

        await db.collection('users').doc(userId).delete();
        res.status(200).send(`User with ID ${userId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).send('Error deleting user: ' + error.message);
    }
};



module.exports = {
    addUser, 
    deleteUser
};
