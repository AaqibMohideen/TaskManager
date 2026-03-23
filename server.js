// ─── server.js ───────────────────────────────────────────────────────────────
// A simple Task Manager REST API built with Node.js and Express.
// Tasks are stored in memory (no database required).
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
// Parse incoming JSON request bodies so we can read req.body
app.use(express.json());

// Serve static files (index.html, CSS, etc.) from the project root directory
app.use(express.static(path.join(__dirname)));

// ── In-memory data store ──────────────────────────────────────────────────────
// A simple array that holds all tasks for the lifetime of the server process.
// Each task: { id: <number>, text: <string> }
let tasks = [];

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /tasks  →  Return all tasks as a JSON array
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks  →  Add a new task
// Expects JSON body: { "text": "your task description" }
app.post('/tasks', (req, res) => {
  const { text } = req.body;

  // Validate: text must be a non-empty string
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required and cannot be empty.' });
  }

  const newTask = {
    id: Date.now(),       // Use current timestamp as a unique ID
    text: text.trim(),    // Remove leading/trailing whitespace
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// DELETE /tasks/:id  →  Delete a task by its id
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted successfully.' });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Task Manager server is running at http://localhost:${PORT}`);
});

module.exports = app; // Export for testing purposes
