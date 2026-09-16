# Task Management System

Node/Express backend for a basic task management API.

## Architecture

```mermaid
flowchart TD
	A[Client\nBrowser / Postman] --> B[Logging Middleware\nLogs method, URL, timestamp]
	B --> C[Express Router]
	C --> D[GET /tasks\ngetAllTasks]
	C --> E[POST /tasks\ncreateTask]
	C --> F[PUT /tasks/:id\nupdateTask]
	C --> G[DELETE /tasks/:id\nremoveTask]
	D --> H[Global Error Handler]
	E --> H
	F --> H
	G --> H
```

## Problem Definition

- Build a Node/Express backend for a Task Management system.
- Implement REST endpoints for creating, reading, updating, and deleting tasks.
- Use an in-memory array for now, with no database.
- Apply a request logging middleware that logs method, URL, and timestamp for every request.
- Apply a global error handling middleware as the last middleware in the pipeline.
- Use correct HTTP status codes: `200`, `201`, `404`, and `500`.

## Run Guide

### Prerequisites

- Node.js 18 or later
- npm

### Install

1. Install dependencies with `npm install`.

### Start

1. Start the API with `npm start`.
2. For development with auto-reload, use `npm run dev`.

### Use the API

Send requests to `http://localhost:3000/tasks`.

- `GET /tasks` to read all tasks.
- `POST /tasks` to create a task.
- `PUT /tasks/:id` to update a task.
- `DELETE /tasks/:id` to delete a task.

Example JSON body for create or update:

```json
{
	"title": "Learn Express",
	"completed": false
}
```

## Sample Data

### GET /tasks

Sample response:

```json
[
	{
		"id": 1,
		"title": "Sample task",
		"completed": false
	}
]
```

### POST /tasks

Sample request body:

```json
{
	"title": "Write API documentation",
	"completed": false
}
```

Sample response:

```json
{
	"id": 2,
	"title": "Write API documentation",
	"completed": false
}
```

### PUT /tasks/:id

Sample request body:

```json
{
	"title": "Write API documentation",
	"completed": true
}
```

Sample response:

```json
{
	"id": 2,
	"title": "Write API documentation",
	"completed": true
}
```

### DELETE /tasks/:id

Sample response:

```json
{
	"id": 2,
	"title": "Write API documentation",
	"completed": true
}
```

## Endpoints

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

---

## Frontend & Practical 8: Performance Optimization & Code Splitting

The React frontend (`task_management_system_frontend`) implements route-level and component-level code splitting using `React.lazy()` and `<Suspense>`:

- **Route Lazy Loading**: `/` (Home Tasks), `/analytics` (Analytics), and `/contact` (Contact) are downloaded strictly on demand.
- **Component-Level Lazy Loading**: The heavy `chart.js` visualizer is isolated into its own `TaskAnalyticsChart` chunk (~167 kB), avoiding unneeded downloads for non-analytics users.
- **Suspense Fallback UI**: Beautiful glassmorphic fallback with skeleton pulse and loading spinner.
- **Anti-Flicker Threshold**: Integrated `lazyWithDelay` preventing loading flashes on fast connections.
- **Error Boundary**: Chunk loading failure handling with retry option.

### Running Frontend
```bash
cd task_management_system_frontend
npm install
npm run dev
```

### Production Build
```bash
npm run build
```
See [PRACTICAL-8.md](file:///d:/Learning/AWF/task_management_system/PRACTICAL-8.md) for full metrics, diagrams, and evaluation rubrics.