const mongoose = require("mongoose");
const supertest = require("supertest");
const Note = require("../models/note");
const app = require("../app");
const api = supertest(app);
const { initialNotes, nonExistingId, notesInDb } = require("./test_helper");

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
});

describe("when there is initially some notes saved", () => {
  test("notes are returened as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((r) => r.content);
    expect(contents).toContain("Browser can execute only JavaScript");
  });
});

describe("viewing a specific note", () => {
  test("succeeds with a valid id", async () => {
    const notes = await notesInDb();
    const noteToView = notes[0];
    console.log(noteToView);

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

    expect(resultNote.body).toEqual(processedNoteToView);
  });

  test("fails with status code 404 if note does not exist", async () => {
    const validNonexistingId = await nonExistingId();
    console.log(validNonexistingId);

    await api.get(`/api/notes/${validNonexistingId}`).expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "629993f868b34a641021634";

    await api.get(`/api/notes/${invalidId}`).expect(400);
  });
});

describe("addition of a new note", () => {
  test("succeeds with valid data", async () => {
    const newNote = {
      content: "async/await simplifies making async calls",
      important: true,
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const notes = await notesInDb();
    expect(notes).toHaveLength(initialNotes.length + 1);

    const contents = notes.map((note) => note.content);
    expect(contents).toContain(newNote.content);
  });

  test("fail with status code 400 if data is invalid", async () => {
    const newNode = {
      important: true,
    };

    await api.post("/api/notes").send(newNode).expect(400);
    const notes = await notesInDb();
    expect(notes).toHaveLength(initialNotes.length);
  });
});

describe("deletion of a note", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const notes = await notesInDb();
    const noteToDelete = notes[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const newNotes = await notesInDb();
    expect(newNotes).toHaveLength(initialNotes.length - 1);

    const contents = newNotes.map((note) => note.content);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
