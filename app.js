const express = require("express");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const mongoose = require("mongoose");

logger.info("Connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB!");
  })
  .catch((err) => {
    logger.error("Error while connecting to MongoDB: ", err.message);
  });

const app = express();
app.use(cors);
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
