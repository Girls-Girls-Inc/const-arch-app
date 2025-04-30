'use strict';

const { db } = require('../db');
const Bookmark = require('../models/bookmark');

const addBookmark = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        const data = req.body;
        console.log('Firestore DB object:', db);  // Log the actual Firestore instance


        console.log('Received data:', data);
        await db.collection('bookmark').doc().set(data);
        res.send('Bookmark saved successfully!');
    } catch (error) {
        console.error('Error saving upload:', error.message);
        res.status(400).send(error.message);
    }
};

module.exports = {
    addBookmark
};
