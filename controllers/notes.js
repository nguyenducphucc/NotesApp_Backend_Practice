const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (req, res) => {
  //   Note.find({}).then((notes) => {
  //     res.json(notes);
  //   });
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  note ? res.json(note) : res.status(404).end();
});

notesRouter.post("/", async (req, res) => {
  const body = req.body;

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  const savedNote = await newNote.save();
  res.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (req, res) => {
  await Note.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

notesRouter.put("/:id", async (req, res) => {
  const body = req.body;

  const changedNote = {
    content: body.content,
    important: body.important,
  };

  const returnedNote = await Note.findByIdAndUpdate(
    req.params.id,
    changedNote,
    { new: true }
  );
  res.json(returnedNote);
});

module.exports = notesRouter;
