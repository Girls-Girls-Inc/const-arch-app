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

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        if (!userId || !updates) {
            return res.status(400).send('User ID and update data are required.');
        }

        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).send('User not found.');
        }

        await userRef.update(updates);
        //res.status(200).send(`User with ID ${userId} updated successfully (PATCH).`);
        res.status(200).json({ message: `User with ID ${userId} updated successfully.` });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).send('Error updating user: ' + error.message);
    }
};

const replaceUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const newData = req.body;

        if (!userId || !newData || !newData.email) {
            return res.status(400).send('User ID and complete data (at least email) are required.');
        }

        const data = {
            uid: userId,
            name: newData.name || "",
            email: newData.email,
            isAdmin: newData.isAdmin || false,
            photoURL: newData.photoURL || "",
            createdAt: newData.createdAt || new Date().toISOString(),
            profileComplete: [
                userId, newData.isAdmin, newData.email, newData.name, newData.photoURL, newData.createdAt
            ].every(Boolean)
        };

        await db.collection('users').doc(userId).set(data, { merge: false }); // overwrite all
        res.status(200).send(`User with ID ${userId} replaced successfully (PUT).`);
    } catch (error) {
        console.error('Error replacing user:', error.message);
        res.status(500).send('Error replacing user: ' + error.message);
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
    deleteUser, 
    updateUser, 
    replaceUser
};
