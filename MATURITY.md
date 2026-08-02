# Richardson Maturity Model Evaluation - Practical 4

## API Assessment

Current level: **Level 2**

The Task Management API in Practical 4 already uses separate resource URLs such as `/api/tasks` and `/api/tasks/:id`, proper HTTP methods like `GET`, `POST`, `PUT`, and `DELETE`, and meaningful status codes such as `200`, `201`, `400`, `404`, `415`, and `500`. Because of that, it satisfies Richardson Maturity Model Level 2.

## Level-by-Level Table

| Level | Meaning | Current API Status |
| --- | --- | --- |
| 0 | Uses one endpoint as a simple tunnel with a single HTTP method or RPC-style requests. | Not satisfied. The API is not a single tunnel-style endpoint. |
| 1 | Uses different URLs for different resources. | Satisfied. The API exposes `/api/tasks`, `/api/tasks/:id`, and supporting utility routes. |
| 2 | Uses correct HTTP verbs and meaningful status codes. | Satisfied. `GET`, `POST`, `PUT`, and `DELETE` are used correctly, with status codes for success and errors. |
| 3 | Adds HATEOAS links so responses guide the client to next actions. | Not implemented. This is awareness only. |

## HATEOAS Awareness Example

Level 3 would add links inside the JSON response so the client can discover actions without hardcoding everything.

```json
{
  "status": 200,
  "task": {
    "id": "1",
    "title": "Complete Practical 4"
  },
  "_links": {
    "self": { "href": "/api/tasks/1" },
    "collection": { "href": "/api/tasks" },
    "update": { "href": "/api/tasks/1", "method": "PUT" },
    "delete": { "href": "/api/tasks/1", "method": "DELETE" }
  }
}
```

## Why Most Production APIs Stop at Level 2

Most production APIs stop at Level 2 because it gives a good balance of clarity, simplicity, and client flexibility. Level 3 adds extra response complexity, tighter coupling to hypermedia conventions, and more work for both the server and client, so many teams prefer the simpler Level 2 style unless they truly need discoverable workflows.
