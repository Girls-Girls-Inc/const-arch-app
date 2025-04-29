'use strict';

const { db } = require('../db');  // Import the db instance from db.js
const Directory = require('../models/directory');

const addDirectory = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        const data = req.body;
        console.log('Firestore DB object:', db);  // Log the actual Firestore instance

        if (!data || !data.id || !data.name || !data.createdBy || !data.createdAt) {
            return res.status(400).send('Missing required fields: id, name, createdBy, createdAt');
        }

        console.log('Received data:', data);

        // Make sure we are accessing the Firestore collection correctly
        await db.collection('directory').doc().set(data);
        res.send('Directory saved successfully!');
    } catch (error) {
        console.error('Error saving directory:', error.message);
        res.status(400).send('Error saving directory: ' + error.message);
    }
};

module.exports = {
    addDirectory
};

