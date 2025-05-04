// routes/user-routes.js
const express = require('express');
const { addUser, deleteUser, updateUser, replaceUser } = require('../controllers/userController');

const router = express.Router();

router.post('/user', addUser);
router.delete('/user/:id', deleteUser);
router.patch('/user/:id', updateUser);
router.put('/user/:id', replaceUser); // Use PUT for replacing user data

module.exports = {
    routes: router
}
