const express = require('express');
const { addBookmark, removeBookmark } = require('../controllers/bookmarkController');

const router = express.Router();

router.post('/bookmark', addBookmark);
router.delete('/bookmark/:id', removeBookmark);

module.exports = {
    routes: router
};
