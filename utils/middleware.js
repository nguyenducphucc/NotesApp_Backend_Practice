const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method);
  console.log("path: ", req.path);
  console.log("Body: ", req.body);
  console.log("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.log(err);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
  }

  next(err);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
