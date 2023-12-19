const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API routes
const dbFilePath = path.join(__dirname, "db", "db.json");

app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbFilePath, "utf8"));
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync(dbFilePath, "utf8"));

  // Assigning a unique ID
  newNote.id = Date.now();

  notes.push(newNote);

  fs.writeFileSync(dbFilePath, JSON.stringify(notes));

  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const notes = JSON.parse(fs.readFileSync(dbFilePath, "utf8"));

  const updatedNotes = notes.filter((note) => note.id !== noteId);

  fs.writeFileSync(dbFilePath, JSON.stringify(updatedNotes));

  res.json({ message: "Note deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
