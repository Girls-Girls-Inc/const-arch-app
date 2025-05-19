const express = require('express');
const { router } = require('../controllers/settingsUpdate');

const settingsRoutes = express.Router();

settingsRoutes.use('/settings', router);

module.exports = {
  routes: settingsRoutes,
};
