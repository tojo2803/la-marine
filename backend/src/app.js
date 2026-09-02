const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ressource non trouvée." });
});

app.use(errorHandler);

module.exports = app;
