const express = require('express');
const { addDirectory } = require('../controllers/directoryController');

const router = express.Router();

router.post('/directory', addDirectory);

module.exports = {
    routes: router
};
