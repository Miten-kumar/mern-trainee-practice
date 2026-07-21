# API Integration Test Suite

Small todo app (auth + CRUD) with a real integration test suite - happy
paths, error cases, edge cases, database state checks, and a test for
an actual transaction. All 24 tests pass, run for real, not just
written and assumed to work.

## Structure

```
backend/
  src/
    app.js               - builds the express app (doesn't call listen itself)
    server.js               - real entry point, creates a file db and starts listening
    db.js                     - creates a db and runs migrations on it
    migrations/                - numbered .sql files, run in order
    seed.js                       - demo user + todos for local dev
    routes/
      auth.js                      - register, login
      todos.js                       - CRUD + bulk-complete (the transaction)
    middleware/
      requireAuth.js                  - checks the bearer token
  tests/
    auth.test.js                        - register + login tests
    todos.test.js                         - CRUD + ownership + transaction tests
frontend/
  src/App.jsx              - small login + todo list, just to click through by hand
```

## Running it

```
cd backend
npm install
npm test              # runs the whole suite
npm run dev:seed      # starts the real server with demo data (demo@example.com / password123)
```

```
cd frontend
npm install
npm run dev
```

Needs Node 22.5+ (uses the built-in `node:sqlite` - still experimental,
the warning on startup is expected, not a bug).

## Why the app is structured this way

`app.js` builds the Express app around whatever `db` you hand it,
instead of importing one fixed database connection - it never calls
`.listen()` itself either. That's the whole trick that makes this
testable: every test creates its own throwaway `:memory:` database, runs
the same migrations against it, and builds a fresh app around that. No
two tests ever share data, and none of them touch the real dev database.
`server.js` is the only place that creates a real file-backed db and
actually starts listening on a port.

## What the test suite actually covers

**Auth (`auth.test.js`, 12 tests)**
- happy path: register, login, both return what's expected
- actually checks the database, not just the response - e.g. confirms
  the password is stored hashed, confirms a session row gets created on
  login
- error cases: missing email/password, password too short, duplicate
  email, wrong password, login with an email that was never registered
- edge case: wrong-password and unknown-email return the exact same
  error message (so a login form can't be used to check which emails
  are registered)
- duplicate-email test also checks the db directly to confirm the
  rejected attempt didn't insert a second row

**Todos (`todos.test.js`, 12 tests)**
- happy path: full CRUD - create, read, update, delete
- error cases: no token, invalid token, missing title, updating/deleting
  something that doesn't exist
- edge case: whitespace-only title rejected
- edge case: one user can't see or edit another user's todos (creates a
  todo as user A, logs in as user B, confirms the list is empty and a
  direct edit attempt 404s)
- delete is checked against the database directly, not just the
  response status

**The transaction (`bulk-complete`, inside `todos.test.js`)**
`POST /api/todos/bulk-complete` marks several todos completed in one
request, wrapped in `BEGIN`/`COMMIT`/`ROLLBACK`. The important test here
sends a list of ids where the last one doesn't exist, and checks the
**database directly** afterward to confirm the earlier, valid ids in
that same list were NOT marked complete - proving the whole batch rolled
back instead of partially applying.

I actually verified this test is meaningful and not just trivially
passing: temporarily removed the `BEGIN`/`COMMIT`/`ROLLBACK` calls from
the route, reran just that test, and watched it fail exactly as
expected (`row1.completed` came back `1` instead of `0`, since without
the transaction the first update wasn't rolled back). Put the real code
back afterward and confirmed all 24 tests pass again.

## Actual test output

```
PASS tests/todos.test.js
PASS tests/auth.test.js

Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
```
