# Richardson Maturity Evaluation

## Overall Result

The current Task Management API satisfies Richardson Maturity Model **Level 2**.

It uses resource-oriented URLs such as `/tasks` and `/tasks/:id`, applies the correct HTTP verbs for CRUD operations, and returns meaningful HTTP status codes such as `200`, `201`, and `404`. It does not yet expose hypermedia controls, so it does not reach Level 3.

## Level Table

| Level | Criterion | Does your API satisfy this? | Evidence |
| --- | --- | --- | --- |
| 0 | RPC-style endpoint that treats HTTP as a transport and usually exposes a single endpoint with verb-like behavior | No | The API is split into resource-based routes such as `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, and `DELETE /tasks/:id`, so it is not a single RPC-style endpoint. |
| 1 | Resource-based URLs with separate paths for resources | Yes | The API exposes `/tasks` for the task collection and `/tasks/:id` for task-specific operations. This is a noun-based URL design rather than verb-based endpoints. |
| 2 | Uses correct HTTP verbs and meaningful status codes | Yes | `GET /tasks` returns `200`, `POST /tasks` returns `201`, `PUT /tasks/:id` returns `200`, and missing task updates or deletes return `404`. The route implementation is in `src/routes/tasks.js` and `src/controllers/tasksController.js`. |
| 3 | Adds HATEOAS links so responses guide the client to next actions | No | The current JSON responses do not include `_links` or other hypermedia controls. Clients must already know the available endpoints instead of discovering them from the response body. |

## Endpoint Evaluation

| Endpoint | Level 0 | Level 1 | Level 2 | Evidence |
| --- | --- | --- | --- | --- |
| `GET /tasks` | Pass | Pass | Pass | Returns the task collection from `getAllTasks` with status `200`. |
| `POST /tasks` | Pass | Pass | Pass | Creates a task with `createTask` and returns the created resource with status `201`. |
| `PUT /tasks/:id` | Pass | Pass | Pass | Updates an existing task and returns `200`; if the task does not exist, it returns `404`. |
| `DELETE /tasks/:id` | Pass | Pass | Pass | Deletes an existing task and returns `200`; if the task does not exist, it returns `404`. |

## HATEOAS Awareness

If this API were extended to Level 3, I would add links like these to each task representation:

```json
{
  "id": "123",
  "title": "Task A",
  "completed": false,
  "_links": {
    "self": "/tasks/123",
    "delete": "/tasks/123"
  }
}
```

Two useful links to add would be:

1. `self` to let the client refresh or inspect the current task resource.
2. `delete` to let the client know how to remove that task without hard-coding the route.

## Why Most Production APIs Stop at Level 2

Most production APIs stop at Level 2 because it gives a strong balance of clarity, interoperability, and simplicity. Clients can rely on standard HTTP verbs and status codes without needing to parse hypermedia controls, and teams can keep API contracts easier to document, test, and version. Level 3 can improve discoverability, but it adds response complexity and client logic that many applications do not need.
