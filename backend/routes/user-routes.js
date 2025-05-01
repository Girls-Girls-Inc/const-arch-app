// routes/user-routes.js
const express = require('express');
const { addUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/user', addUser);
router.delete('/user/:id', deleteUser);

module.exports = {
    routes: router
}
