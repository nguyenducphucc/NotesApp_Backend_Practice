const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      note ? res.json(note) : res.status(404).end();
    })
    .catch((err) => next(err));
});

notesRouter.post("/", (req, res, next) => {
  const body = req.body;

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  newNote
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((err) => next(err));
});

notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

notesRouter.put("/:id", (req, res, next) => {
  Note.findByIdAndUpdate(req.params.id)
    .then((changedNote) => {
      res.json(changedNote);
    })
    .catch((err) => next(err));
});

module.exports = notesRouter;
