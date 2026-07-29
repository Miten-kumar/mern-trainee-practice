# Error Handling Demo Dashboard

Small learning project - a dashboard with multiple widgets, each one can
fail in a different way (network error, API error, runtime error), and
each is handled properly instead of crashing the whole page.

- `frontend/` - React + TypeScript + Vite, plain CSS
- `backend/` - Node + Express, minimal, stores logged errors in a json file

## What it covers
- Error boundaries at 3 levels: root (whole app), page, and section/widget
- Different fallback UI per level (full page crash screen vs small inline
  "this widget failed" box)
- A small error logging service that sends caught errors to the backend
- Retry with exponential backoff for network/server errors (not for 4xx
  client errors, those won't succeed on retry anyway)
- Handles network errors, API errors (4xx/5xx) and runtime (JS) errors
  differently - different messages, different retry behavior
- A tiny "error analytics" panel showing how many errors of each type
  happened this session

## How to run

### Backend
```
cd backend
npm install
npm run dev
```
Runs on http://localhost:4000

### Frontend
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

## Running tests
```
cd backend && npm install && npm test
cd frontend && npm install && npm test
```
