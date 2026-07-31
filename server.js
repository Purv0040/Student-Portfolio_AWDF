// ============================================================================
// Practical 4: Building a RESTful API with Node.js and Express (server.js)
// CO/PO CO2 / PO3, PO5
// ============================================================================
// This file demonstrates the vanilla JavaScript implementation of Practical 4.
// Note: In our Vite full-stack environment, `server.ts` is executed via tsx
// during development and esbuild for production bundles.
// ============================================================================

import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Step 3: Request logging middleware applied globally
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Step 4: In-memory temporary task storage
let tasks = [
  { id: "1", title: "Complete Practical 4: Node.js & Express REST API", status: "Completed" },
  { id: "2", title: "Verify Postman / Thunder Client Status Codes", status: "In Progress" }
];

// CRUD Endpoints
app.get('/tasks', (req, res) => res.status(200).json(tasks));
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  task ? res.status(200).json(task) : res.status(404).json({ error: "Not Found" });
});
app.post('/tasks', (req, res) => {
  const newTask = { id: String(Date.now()), title: req.body.title || "New Task", status: "Pending" };
  tasks.push(newTask);
  res.status(201).json(newTask);
});
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Not Found" });
  task.title = req.body.title || task.title;
  res.status(200).json(task);
});
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.status(200).json({ message: "Deleted successfully" });
});

// Step 5: Global error handling middleware as the final middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

export default app;
