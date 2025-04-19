'use strict';

const db =  require('../db');
const User = require('../models/user');

const addUser = async(req, res, next) => {
    try {
        const data = req.body;
        await db.collection('users').doc().set(data);
        res.send('Record saved Successfully!');
    }catch(error){
        res.status(400).send(error.message);
    }
}

module.exports = {
    addUser
}