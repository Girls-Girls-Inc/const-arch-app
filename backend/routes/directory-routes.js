const express = require('express');
const { addDirectory, deleteDirectory } = require('../controllers/directoryController');


const router = express.Router();

router.post('/directory', addDirectory);
router.delete('/directory/:id', deleteDirectory);

module.exports = {
    routes: router
};
