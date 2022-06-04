const Note = require("../models/note");

const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only JavaScript",
    date: new Date(),
    important: true,
  },
];

const nonExistingId = async () => {
  const note = new Note({
    content: "willremovethissoon",
    date: new Date(),
  });

  const savedNote = await note.save();
  await note.remove();

  return savedNote._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
};
