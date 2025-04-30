const express = require('express');
const { addUpload } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', addUpload);

module.exports = {
    routes: router
};

