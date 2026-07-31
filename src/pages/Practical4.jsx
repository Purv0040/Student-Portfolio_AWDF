import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

export default function Practical4() {
  // --- STATE FOR TASKS & LOADING ---
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for creating new task
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [status, setStatus] = useState('Pending');

  // --- STATE FOR EXPRESS MIDDLEWARE INSPECTOR ---
  const [serverLogs, setServerLogs] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  // --- 1. FETCH TASKS FROM EXPRESS REST API (GET /api/tasks) ---
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'All') queryParams.append('status', statusFilter);
      if (priorityFilter !== 'All') queryParams.append('priority', priorityFilter);
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

      const res = await fetch(`/api/tasks?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setTasks(data.tasks || []);
      fetchServerLogs();
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks from Express server.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery]);

  // --- 2. FETCH EXPRESS MIDDLEWARE REQUEST LOGS (Step 3) ---
  const fetchServerLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/server-logs');
      if (res.ok) {
        const data = await res.json();
        setServerLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Error fetching server logs:', e);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- 3. CREATE NEW TASK (POST /api/tasks) ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Task Title is required.');
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim() || 'General',
          description: description.trim(),
          priority,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error (${res.status}): ${data.message || 'Failed to create task'}`);
        return;
      }

      setTitle('');
      setCategory('');
      setDescription('');
      setPriority('Normal');
      setStatus('Pending');
      fetchTasks();
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  };

  // --- 4. UPDATE TASK STATUS / PRIORITY (PUT /api/tasks/:id) ---
  const handleUpdateTaskStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchTasks();
      } else {
        const data = await res.json();
        alert(`Failed to update task (${res.status}): ${data.message || data.error}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  };

  // --- 5. DELETE TASK (DELETE /api/tasks/:id) ---
  const handleDeleteTask = async (id, taskTitle) => {
    if (!window.confirm(`Delete task "${taskTitle}" (ID: ${id}) from the Express server?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchTasks();
      } else {
        const data = await res.json();
        alert(`Delete failed (${res.status}): ${data.message || data.error}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  };

  // --- 6. RESET TASK REPOSITORY TO DEFAULT (POST /api/tasks/reset) ---
  const handleResetTasks = async () => {
    try {
      const res = await fetch('/api/tasks/reset', { method: 'POST' });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      alert(`Reset error: ${err.message}`);
    }
  };

  // --- 7. INTERACTIVE SIMULATOR: TEST EXPRESS MIDDLEWARE PIPELINE ---
  const runApiTest = async (testName, endpoint, options = {}, expectedStatus, explanation) => {
    setTestLoading(true);
    setTestResult({
      testName,
      endpoint,
      method: options.method || 'GET',
      expectedStatus,
      explanation,
      status: 'Running...',
      body: null,
    });

    try {
      const startTime = Date.now();
      const res = await fetch(endpoint, options);
      const duration = Date.now() - startTime;
      let jsonBody = null;
      try {
        jsonBody = await res.json();
      } catch {
        jsonBody = { rawText: 'Non-JSON Response' };
      }

      setTestResult({
        testName,
        endpoint,
        method: options.method || 'GET',
        expectedStatus,
        status: res.status,
        statusText: res.statusText,
        duration,
        body: jsonBody,
        explanation,
        success:
          res.status === expectedStatus ||
          (expectedStatus === 415 && (res.status === 415 || res.status === 400)),
      });

      fetchServerLogs();
    } catch (err) {
      setTestResult({
        testName,
        endpoint,
        method: options.method || 'GET',
        expectedStatus,
        status: 'Network Error',
        body: { error: err.message },
        explanation,
        success: false,
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div id="practical-4-page">
      <h1>Practical 4: RESTful API with Node.js &amp; Express</h1>
      <p>CO/PO CO2 / PO3, PO5 - Complete Express middleware pipeline implementing CRUD endpoints, request logging middleware, route-specific ID validation, and centralized 500 &amp; 404 error handlers.</p>
      
      <p>
        <button type="button" onClick={handleResetTasks}>
          Reset Tasks to Default
        </button>
      </p>

      <hr />

      {/* =========================================================
          CREATE TASK FORM
      ========================================================= */}
      <h2>Create New Task (POST /api/tasks)</h2>
      <form onSubmit={handleCreateTask}>
        <p>
          <label htmlFor="task-title">Task Title: </label>
          <br />
          <input
            type="text"
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Implement Express Authentication"
            required
            size={50}
          />
        </p>

        <p>
          <label htmlFor="task-cat">Category: </label>
          <br />
          <input
            type="text"
            id="task-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Backend"
          />
        </p>

        <p>
          <label htmlFor="task-desc">Description: </label>
          <br />
          <textarea
            id="task-desc"
            rows={3}
            cols={50}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task details..."
          />
        </p>

        <p>
          <label htmlFor="task-prio">Priority: </label>
          <select
            id="task-prio"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Normal">Normal</option>
          </select>
          {'  '}
          <label htmlFor="task-status">Status: </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </p>

        <p>
          <button type="submit">Add Task</button>
        </p>
      </form>

      <hr />

      {/* =========================================================
          TASK REPOSITORY LIST (CRUD READ / UPDATE / DELETE)
      ========================================================= */}
      <h2>Task Repository (GET /api/tasks)</h2>
      <p>
        <label htmlFor="search-input">Search: </label>
        <input
          type="text"
          id="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
        />
        {'  '}
        <label htmlFor="status-filter">Status Filter: </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {'  '}
        <label htmlFor="priority-filter">Priority Filter: </label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Normal">Normal</option>
        </select>
      </p>

      {loading ? (
        <p>Loading tasks from Express server...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>#{t.id}</td>
                <td><strong>{t.title}</strong></td>
                <td>{t.category}</td>
                <td>{t.priority}</td>
                <td>
                  <select
                    value={t.status}
                    onChange={(e) => handleUpdateTaskStatus(t.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>{t.description || 'N/A'}</td>
                <td>
                  <button type="button" onClick={() => handleDeleteTask(t.id, t.title)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      {/* =========================================================
          EXPRESS MIDDLEWARE & PIPELINE INSPECTOR (LAB SIMULATOR)
      ========================================================= */}
      <h2>Express Middleware Pipeline Inspector (Step 6 &amp; Supplementary Problems)</h2>
      <p>Simulate HTTP requests to test status codes (200, 201, 400, 404, 415, 500):</p>
      
      <p>
        <button
          type="button"
          onClick={() =>
            runApiTest(
              '1. GET /api/tasks (Read All)',
              '/api/tasks',
              { method: 'GET' },
              200,
              'Standard READ endpoint: Returns status code 200 OK and a JSON array of all tasks.'
            )
          }
        >
          Test GET /api/tasks (200 OK)
        </button>
        {'  '}
        <button
          type="button"
          onClick={() =>
            runApiTest(
              '2. POST /api/tasks (Create Task)',
              '/api/tasks',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: 'Test Created Task via Simulator',
                  category: 'Express Lab Test',
                  priority: 'High',
                  description: 'Automated test task created to verify 201 Created response.',
                }),
              },
              201,
              'Standard CREATE endpoint: Returns HTTP 201 Created with the new task.'
            )
          }
        >
          Test POST /api/tasks (201 Created)
        </button>
        {'  '}
        <button
          type="button"
          onClick={() =>
            runApiTest(
              '3. POST without Content-Type Header',
              '/api/tasks',
              {
                method: 'POST',
                body: 'title=MissingJsonHeaderTest',
              },
              415,
              'Supplementary Problem 1: Rejects POST/PUT requests without application/json header with 415 Unsupported Media Type / 400 status.'
            )
          }
        >
          Test Missing Content-Type (415 Error)
        </button>
        {'  '}
        <button
          type="button"
          onClick={() =>
            runApiTest(
              '4. GET /api/tasks/invalid_id_999$#',
              '/api/tasks/invalid_id_999$#',
              { method: 'GET' },
              400,
              'Supplementary Problem 2: Route-specific ID validator rejects malformed IDs with 400 Bad Request.'
            )
          }
        >
          Test Invalid Task ID (400 Bad Request)
        </button>
        {'  '}
        <button
          type="button"
          onClick={() =>
            runApiTest(
              '5. GET /api/undefined-endpoint-test',
              '/api/undefined-endpoint-test',
              { method: 'GET' },
              404,
              'Supplementary Problem 3: Catch-all JSON 404 middleware for undefined API routes.'
            )
          }
        >
          Test Undefined Route (404 Not Found)
        </button>
        {'  '}
        <button
          type="button"
          onClick={() =>
            runApiTest(
              '6. GET /api/tasks-test-500 (Global Error)',
              '/api/tasks-test-500',
              { method: 'GET' },
              500,
              'Step 5 Requirement: Express Global Error Handler returns JSON: { error: "Something went wrong" }.'
            )
          }
        >
          Test Global Error Handler (500 Error)
        </button>
      </p>

      {/* Live Test Output Display */}
      {testResult && (
        <div>
          <h3>Test Output: {testResult.testName}</h3>
          <p>
            <strong>Status:</strong> {testResult.status} {testResult.statusText} |{' '}
            <strong>Time:</strong> {testResult.duration} ms
          </p>
          <p>
            <strong>Explanation:</strong> {testResult.explanation}
          </p>
          <p>
            <strong>Response Body (JSON):</strong>
          </p>
          <pre>{JSON.stringify(testResult.body, null, 2)}</pre>
        </div>
      )}

      <hr />

      {/* =========================================================
          LIVE SERVER REQUEST LOGS
      ========================================================= */}
      <h2>Live Server Request Logs (Global Middleware)</h2>
      <p>
        <button type="button" onClick={fetchServerLogs}>
          Refresh Logs
        </button>
      </p>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Method</th>
            <th>URL Endpoint</th>
            <th>Timestamp (ISO)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {serverLogs.length === 0 ? (
            <tr>
              <td colSpan={4}>No requests logged yet.</td>
            </tr>
          ) : (
            serverLogs.map((log) => (
              <tr key={log.id}>
                <td><strong>{log.method}</strong></td>
                <td>{log.url}</td>
                <td>{log.timestamp}</td>
                <td>{log.status || 200}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <hr />

      {/* =========================================================
          API REFERENCE TABLE
      ========================================================= */}
      <h2>API Reference</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>HTTP Method</th>
            <th>Endpoint URL</th>
            <th>Status Code</th>
            <th>Middleware Applied</th>
            <th>Description &amp; Body Schema</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>GET</strong></td>
            <td>/api/tasks</td>
            <td>200 OK</td>
            <td>Request Logger</td>
            <td>Returns JSON array of all tasks. Supports optional filtering via ?status=Completed.</td>
          </tr>
          <tr>
            <td><strong>GET</strong></td>
            <td>/api/tasks/:id</td>
            <td>200 / 404</td>
            <td>Request Logger, ID Validator</td>
            <td>Returns single task by ID. Rejects malformed IDs with 400 Bad Request.</td>
          </tr>
          <tr>
            <td><strong>POST</strong></td>
            <td>/api/tasks</td>
            <td>201 Created</td>
            <td>Request Logger, requireJsonContentType</td>
            <td>Creates new task. Requires Content-Type: application/json header.</td>
          </tr>
          <tr>
            <td><strong>PUT</strong></td>
            <td>/api/tasks/:id</td>
            <td>200 / 404</td>
            <td>Request Logger, requireJsonContentType, ID Validator</td>
            <td>Updates task fields by ID. Requires JSON Content-Type header.</td>
          </tr>
          <tr>
            <td><strong>DELETE</strong></td>
            <td>/api/tasks/:id</td>
            <td>200 / 404</td>
            <td>Request Logger, ID Validator</td>
            <td>Deletes task from temporary storage array by ID. Returns confirmation JSON message.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
