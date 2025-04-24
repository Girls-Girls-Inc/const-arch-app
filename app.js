'use strict';

require('dotenv').config();

const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static("./frontend/dist"));
app.use(express.json());

const userRoutes = require('./backend/routes/user-routes');
const settingsRoutes = require('./backend/routes/settings-routes');
//const uploadRoutes = require('./routes/upload-routes');
//const directoryRoutes = require('./routes/directory-routes');
//const bookmarkRoutes = require('./routes/bookmark-routes');

app.use('/api', userRoutes.routes);
app.use('/api', settingsRoutes.routes);
//app.use('/api/upload', uploadRoutes.routes);
//app.use('/api/directory', directoryRoutes.routes);
//app.use('/api/bookmark', bookmarkRoutes.routes);

app.get(/.*/, (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, ".", "frontend", "dist") });
});

module.exports = app;

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});