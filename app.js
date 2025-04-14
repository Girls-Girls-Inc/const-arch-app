const express = require("express");

const app = express();
app.use(express.static("frontend/dist"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
