// app.js
const express = require("express");
const userRoutes = require("./routes/user");
const path = require("path");

const app = express();

app.use(express.static("frontend/dist"));
app.use(express.json());
app.use("/api/user", userRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "frontend", "dist") });
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
