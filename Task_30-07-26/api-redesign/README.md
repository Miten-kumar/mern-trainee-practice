# Task API - Versioned REST Redesign

A small task management API built to demonstrate REST API best
practices: proper HTTP methods and status codes, HATEOAS links,
consistent error responses, OpenAPI documentation, and how to
deprecate an old API version without breaking it overnight.

There are two versions running side by side - `v1` (the "old" API,
kept for backwards compatibility, deprecated) and `v2` (the
redesigned one). Having both lets you actually compare them instead
of just reading about what changed.

---

## Table of contents

- [Setup](#setup)
- [Running it](#running-it)
- [v1 vs v2, side by side](#v1-vs-v2-side-by-side)
- [API reference (v2)](#api-reference-v2)
- [API reference (v1, deprecated)](#api-reference-v1-deprecated)
- [How each requirement is handled](#how-each-requirement-is-handled)
- [Project structure](#project-structure)
- [Testing](#testing)

---

## Setup

```
cd backend
npm install
```

No database, no Redis, nothing else to install - tasks are kept in
memory and reset when the server restarts (see
[Project structure](#project-structure) for why, and what you'd
change for a real app).

## Running it

```
cd backend
npm run dev
```

- API: http://localhost:4000
- Interactive OpenAPI docs (Swagger UI): http://localhost:4000/api-docs
- Raw OpenAPI spec as JSON: http://localhost:4000/openapi.json

## v1 vs v2, side by side

| | v1 (`/api/v1/tasks`) | v2 (`/api/v2/tasks`) |
|---|---|---|
| Status | **Deprecated** - still works, sends deprecation headers | Current |
| Response shape | Flat JSON, just the task fields | Task fields + `_links` (HATEOAS) |
| List endpoint | Returns everything, no pagination | Paginated, filterable by `status` |
| Partial update | Not supported (PUT only, replaces everything) | `PATCH` supported, only sends what's changing |
| Error shape | Ad hoc `{ "message": "..." }`, different per route | Consistent `application/problem+json` (RFC 7807) on every error |
| Discoverability | None - client has to hardcode every URL | Every response tells you what you can do next via `_links` |

That inconsistency in v1's error shape is a real, common problem in
APIs that grew organically - v2 fixes it by routing every single error
through one central handler (`utils/errorHandler.js`) instead of each
route deciding its own error format.

## API reference (v2)

Full interactive docs at `/api-docs`. Quick reference:

| Method | Path | Description |
|---|---|---|
| GET | `/api/v2/tasks` | List tasks (paginated, filterable) |
| GET | `/api/v2/tasks/:id` | Get one task |
| POST | `/api/v2/tasks` | Create a task |
| PUT | `/api/v2/tasks/:id` | Replace a task entirely |
| PATCH | `/api/v2/tasks/:id` | Update only the given fields |
| DELETE | `/api/v2/tasks/:id` | Delete a task |

### List tasks

```
curl "http://localhost:4000/api/v2/tasks?page=1&limit=10&status=pending"
```

```json
{
  "_embedded": {
    "tasks": [
      {
        "id": 3,
        "title": "Write API documentation",
        "status": "pending",
        "priority": "low",
        "_links": {
          "self": { "href": "http://localhost:4000/api/v2/tasks/3", "method": "GET" },
          "update": { "href": "http://localhost:4000/api/v2/tasks/3", "method": "PUT" },
          "patch": { "href": "http://localhost:4000/api/v2/tasks/3", "method": "PATCH" },
          "delete": { "href": "http://localhost:4000/api/v2/tasks/3", "method": "DELETE" },
          "collection": { "href": "http://localhost:4000/api/v2/tasks", "method": "GET" }
        }
      }
    ]
  },
  "_links": {
    "self": { "href": "...?page=1&limit=10", "method": "GET" },
    "first": { "href": "...?page=1&limit=10", "method": "GET" },
    "last": { "href": "...?page=1&limit=10", "method": "GET" }
  },
  "page": 1,
  "limit": 10,
  "totalItems": 1,
  "totalPages": 1
}
```

### Create a task

```
curl -X POST http://localhost:4000/api/v2/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship the redesign","priority":"high"}'
```

Returns `201 Created` with a `Location` header pointing at the new
task, plus the task itself in the body.

### A validation error

```
curl -X POST http://localhost:4000/api/v2/tasks \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{
  "type": "about:blank",
  "title": "Validation Failed",
  "status": 400,
  "detail": "The request contains invalid fields, see errors for details",
  "instance": "/api/v2/tasks",
  "errors": [
    { "field": "title", "message": "title is required and must be a non-empty string" }
  ]
}
```

### Partial update

```
curl -X PATCH http://localhost:4000/api/v2/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

Only `status` changes - every other field on the task stays exactly
as it was. Compare this to `PUT`, which expects (and replaces) the
whole task.

### Delete

```
curl -X DELETE http://localhost:4000/api/v2/tasks/1 -i
```

Returns `204 No Content` - no response body, which is the correct
status code for a successful delete with nothing to send back.

## API reference (v1, deprecated)

Same task fields, but flat (no `_links`), no pagination, and a
different error shape (`{ "message": "..." }`). Every response also
includes these headers so you (or your tooling) know it's on its way
out:

```
Deprecation: true
Sunset: Wed, 31 Dec 2026 23:59:59 GMT
Link: <http://localhost:4000/api/v2/tasks>; rel="successor-version"
```

`Deprecation` and `Sunset` are real, standardized HTTP headers (not
something made up for this project) - see RFC 8594 for `Sunset` and
the IETF deprecation header draft for `Deprecation`. Putting the
notice in headers instead of the response body means existing clients
that only read the body they expect won't break, but anything paying
attention (browser devtools, API gateways, monitoring tools) can flag
it automatically.

```
curl http://localhost:4000/api/v1/tasks -i
```

## How each requirement is handled

**Proper HTTP methods** - GET for reads, POST for creation, PUT for
full replacement, PATCH for partial updates, DELETE for removal. v1
only has GET/POST/PUT/DELETE (no PATCH) - one of several things v2
adds.

**Proper status codes** - `200` for a successful read/update, `201`
with a `Location` header for a successful create, `204` with an empty
body for a successful delete, `400` for validation failures, `404`
for anything not found (including unmatched routes entirely, not just
missing tasks).

**HATEOAS links** - every v2 task response includes `_links` telling
you the URL and HTTP method for updating, patching, deleting it, or
going back to the collection (`utils/hateoas.js`). The list endpoint
similarly includes `self`/`first`/`prev`/`next`/`last` links for
pagination, so a client can page through results without constructing
URLs itself.

**Comprehensive error responses** - every v2 error (validation, not
found, unexpected server error) goes through one central handler
(`utils/errorHandler.js`) and comes out in the same RFC 7807 "problem
details" shape, with `application/problem+json` as the content type.
Validation errors additionally include an `errors` array pointing at
exactly which field(s) were wrong and why.

**OpenAPI documentation** - `openapi.yaml` describes every v2 endpoint,
request/response schema, and status code, served as an interactive
Swagger UI at `/api-docs` and as raw JSON at `/openapi.json`.

**Deprecation notices** - see
[API reference (v1, deprecated)](#api-reference-v1-deprecated) above -
standard `Deprecation`/`Sunset`/`Link` headers on every v1 response.

## Project structure

```
backend/
  app.js                    - express app: mounts both versions, docs, error handler
  server.js                  - starts the http server
  openapi.yaml                - the OpenAPI 3.0 spec for v2
  data/tasks.js                - in-memory task store (swap for a real db later)
  routes/
    v1/tasks.js                 - old, deprecated endpoints
    v2/tasks.js                  - current endpoints
  middleware/deprecation.js    - attaches Deprecation/Sunset/Link headers to v1 responses
  utils/
    errors.js                    - custom error classes (NotFoundError, ValidationError, ConflictError)
    errorHandler.js               - turns any thrown error into a problem+json response
    hateoas.js                    - builds the _links objects
    pagination.js                  - parses page/limit query params, slices the list
  validators/taskValidator.js   - manual request body validation, no external library
  tests/                        - jest + supertest, no external services needed to run them
```

The task store is a plain in-memory array on purpose - this project is
about API *design*, not persistence. Swapping `data/tasks.js` for
something backed by Postgres/Mongo/etc later wouldn't require changing
any of the routes, validators, or error handling, since they only ever
call `getAll`/`getById`/`create`/`update`/`patch`/`remove`.

## Testing

```
cd backend
npm install
npm test
```

No external services needed - the store is in-memory and gets reset
between tests (`store._reset()`).

- `tests/pagination.test.js`, `tests/hateoas.test.js`,
  `tests/taskValidator.test.js` - pure function unit tests
- `tests/v2.tasks.test.js` - full request/response cycle for every v2
  endpoint: pagination, filtering, HATEOAS links, validation errors,
  404s, PUT vs PATCH behavior
- `tests/v1.tasks.test.js` - confirms the deprecation headers are
  present on every response, and that v1's older behavior (flat
  responses, `{ message }` errors) still works as before
