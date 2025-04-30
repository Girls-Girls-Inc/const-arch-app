const express = require('express');
const { addBookmark } = require('../controllers/bookmarkController');

const router = express.Router();

router.post('/bookmark', addBookmark);

module.exports = {
    routes: router
};
