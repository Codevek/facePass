const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

const faceRoutes = require("./routes/face.routes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/face", faceRoutes);

module.exports = app;