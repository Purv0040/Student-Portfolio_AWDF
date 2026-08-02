import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

let __filename: string;
try {
  __filename = fileURLToPath((import.meta as any).url);
} catch {
  __filename = process.cwd();
}
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable JSON body parsing for incoming requests
app.use(express.json());

// ==========================================
// PRACTICAL 4: SERVER LOGGING MIDDLEWARE (Step 3)
// ==========================================
// In-memory log store so the frontend Lab UI can display real-time Express middleware logs
interface ServerLog {
  id: string;
  method: string;
  url: string;
  timestamp: string;
  status?: number;
  note?: string;
}
let serverLogs: ServerLog[] = [];

// Step 3: Request logging middleware applied globally
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${req.method} ${req.url} - ${timestamp}`;
  console.log(`[Express Logger] ${logMessage}`);

  // Record log in memory (keep last 50 logs for UI inspection)
  const logEntry: ServerLog = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    method: req.method,
    url: req.url,
    timestamp,
  };
  serverLogs = [logEntry, ...serverLogs].slice(0, 50);

  // Hook into finish event to capture final HTTP response status code
  res.on('finish', () => {
    logEntry.status = res.statusCode;
  });

  next();
});

// ==========================================
// IN-MEMORY TASK REPOSITORY (Step 4)
// ==========================================
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Normal';
  status: 'Pending' | 'In Progress' | 'Completed';
  category: string;
  createdAt: string;
}

const getDefaultTasks = (): Task[] => [
  {
    id: "1",
    title: "Complete Practical 4: Node.js & Express REST API",
    description: "Implement 4 CRUD endpoints, global logging middleware, and centralized error handler in server.ts.",
    priority: "High",
    status: "Completed",
    category: "Backend / Lab",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "2",
    title: "Verify Postman / Thunder Client Status Codes",
    description: "Test 200 OK, 201 Created, 400 Bad Request, 404 Not Found, and 500 Internal Server Error responses.",
    priority: "High",
    status: "In Progress",
    category: "Testing",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "3",
    title: "Prepare Practical 5 Database Integration Schema",
    description: "Review MongoDB and relational schema options for migrating in-memory tasks to persistent storage.",
    priority: "Medium",
    status: "Pending",
    category: "Database",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "4",
    title: "Submit React Router & GitHub API Portfolio Report",
    description: "Compile lab reports for Practical 1, 2, and 3 with responsive layout screenshots.",
    priority: "Normal",
    status: "Completed",
    category: "Documentation",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

let tasks: Task[] = getDefaultTasks();
let nextTaskId = 5;

// ==========================================
// SUPPLEMENTARY MIDDLEWARE 1: CONTENT-TYPE VALIDATION
// ==========================================
// Rejects requests without Content-Type: application/json header on POST/PUT
const requireJsonContentType = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type (415 / 400 Error)',
        message: 'Content-Type header must be application/json for POST and PUT requests.',
        practical: 'Practical 4 - Supplementary Problem 1 (Content-Type Validation)'
      });
    }
  }
  next();
};

// ==========================================
// SUPPLEMENTARY MIDDLEWARE 2: TASK ID VALIDATION
// ==========================================
// Route-specific middleware that validates the task ID format before reaching controller
const validateTaskIdFormat = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  // Valid Task ID format: numeric ID (e.g. "1", "2") OR "task-<number>"
  const validIdPattern = /^(\d+|task-\d+)$/i;
  if (!validIdPattern.test(id)) {
    return res.status(400).json({
      error: 'Bad Request - Invalid Task ID Format (400 Error)',
      message: `Task ID "${id}" is malformed. ID must be numeric (e.g., "1", "2") or prefixed (e.g., "task-1").`,
      practical: 'Practical 4 - Supplementary Problem 2 (Route-Specific ID Validator)'
    });
  }
  next();
};

// ==========================================
// PRACTICAL 4: RESTful CRUD ENDPOINTS (Step 4)
// ==========================================

// 0. Test Endpoint: Trigger 500 Global Error Handler (for Step 5 demonstration)
app.get('/api/tasks-test-500', (req, res, next) => {
  // Intentionally throw an unhandled exception to demonstrate Step 5 Global Error Handler
  const error = new Error('Simulated Database Connection Failure / Unhandled Exception (Practical 4 Step 5 Lab Test)');
  next(error);
});

// 1. READ ALL TASKS: GET /api/tasks (Status: 200 OK)
app.get('/api/tasks', (req, res) => {
  const { status, priority, search } = req.query;
  let filteredTasks = [...tasks];

  if (status && status !== 'All') {
    filteredTasks = filteredTasks.filter((t) => t.status.toLowerCase() === String(status).toLowerCase());
  }
  if (priority && priority !== 'All') {
    filteredTasks = filteredTasks.filter((t) => t.priority.toLowerCase() === String(priority).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    filteredTasks = filteredTasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    status: 200,
    count: filteredTasks.length,
    total: tasks.length,
    tasks: filteredTasks
  });
});

// 2. READ SINGLE TASK BY ID: GET /api/tasks/:id (Status: 200 OK / 404 Not Found)
app.get('/api/tasks/:id', validateTaskIdFormat, (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({
      error: 'Task Not Found (404 Error)',
      message: `Task with ID "${id}" does not exist in the in-memory array.`,
      status: 404
    });
  }
  res.status(200).json({ status: 200, task });
});

// 3. CREATE TASK: POST /api/tasks (Status: 201 Created)
app.post('/api/tasks', requireJsonContentType, (req, res) => {
  const { title, description = '', priority = 'Normal', status = 'Pending', category = 'General' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: 'Bad Request (400 Error)',
      message: 'Task "title" is required in the JSON request body.'
    });
  }

  const newTask: Task = {
    id: String(nextTaskId++),
    title: title.trim(),
    description: description.trim(),
    priority: ['High', 'Medium', 'Normal'].includes(priority) ? priority : 'Normal',
    status: ['Pending', 'In Progress', 'Completed'].includes(status) ? status : 'Pending',
    category: category.trim() || 'General',
    createdAt: new Date().toISOString()
  };

  tasks = [newTask, ...tasks];

  res.status(201).json({
    status: 201,
    message: 'Task created successfully',
    task: newTask
  });
});

// 4. UPDATE TASK: PUT /api/tasks/:id (Status: 200 OK / 404 Not Found)
app.put('/api/tasks/:id', requireJsonContentType, validateTaskIdFormat, (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: 'Task Not Found (404 Error)',
      message: `Cannot update: Task with ID "${id}" was not found in temporary storage.`,
      status: 404
    });
  }

  const existingTask = tasks[taskIndex];
  const {
    title = existingTask.title,
    description = existingTask.description,
    priority = existingTask.priority,
    status = existingTask.status,
    category = existingTask.category
  } = req.body;

  const updatedTask: Task = {
    ...existingTask,
    title: title.trim() || existingTask.title,
    description: description.trim(),
    priority: ['High', 'Medium', 'Normal'].includes(priority) ? priority : existingTask.priority,
    status: ['Pending', 'In Progress', 'Completed'].includes(status) ? status : existingTask.status,
    category: category.trim() || existingTask.category
  };

  tasks[taskIndex] = updatedTask;

  res.status(200).json({
    status: 200,
    message: `Task "${id}" updated successfully`,
    task: updatedTask
  });
});

// 5. DELETE TASK: DELETE /api/tasks/:id (Status: 200 OK / 404 Not Found)
app.delete('/api/tasks/:id', validateTaskIdFormat, (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: 'Task Not Found (404 Error)',
      message: `Cannot delete: Task with ID "${id}" was not found in the array.`,
      status: 404
    });
  }

  const deletedTask = tasks[taskIndex];
  tasks = tasks.filter((t) => t.id !== id);

  res.status(200).json({
    status: 200,
    message: `Task "${id}" (${deletedTask.title}) deleted successfully`,
    id
  });
});

// 6. UTILITY ENDPOINT: RESET TASKS IN-MEMORY ARRAY (for lab testing)
app.post('/api/tasks/reset', (req, res) => {
  tasks = getDefaultTasks();
  nextTaskId = 5;
  res.status(200).json({
    status: 200,
    message: 'In-memory task repository reset to default 4 practical tasks.',
    tasks
  });
});

// 7. UTILITY ENDPOINT: GET EXPRESS REQUEST LOGS (for Inspector UI)
app.get('/api/server-logs', (req, res) => {
  res.status(200).json({
    status: 200,
    logs: serverLogs
  });
});

// ==========================================
// SUPPLEMENTARY PROBLEM 3: 404 JSON HANDLER FOR UNDEFINED API ROUTES
// ==========================================
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API Endpoint Not Found (404 Error)',
    message: `The REST API endpoint '${req.method} ${req.originalUrl}' is not defined on this Node.js/Express server.`,
    status: 404,
    practical: 'Practical 4 - Supplementary Problem 3 (Structured JSON 404 Handler)'
  });
});

// ==========================================
// PRACTICAL 4: GLOBAL ERROR HANDLING MIDDLEWARE (Step 5)
// ==========================================
// "Add a global error handling middleware as the final middleware in the pipeline:
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong' });
// });"
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Express Global Error Handler] Stack Trace:', err.stack || err);
  res.status(500).json({
    error: 'Something went wrong',
    details: err.message || 'Internal Server Error',
    practical: 'Practical 4 Step 5 - Centralized Global Error Handling Middleware'
  });
});

// ==========================================
// VITE MIDDLEWARE SETUP (Development & Static Production)
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(` Practical 4: RESTful API with Node.js & Express `);
    console.log(` Server running on http://0.0.0.0:${PORT}        `);
    console.log(`=================================================`);
  });
}

startServer();
