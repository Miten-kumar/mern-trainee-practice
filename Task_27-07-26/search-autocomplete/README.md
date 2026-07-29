# Search Autocomplete

Small learning project - a search box with autocomplete suggestions.

- `frontend/` - React + TypeScript + Vite, plain CSS
- `backend/` - Node + Express, minimal, searches an in-memory list

## What it covers
- Debounced input (waits 200ms after you stop typing before calling the API)
- Request cancellation with `AbortController` - if you type fast, older
  in-flight requests get cancelled so an old slow response can't overwrite
  newer results
- A small in-memory cache per search term, so re-typing something you
  already searched shows instantly with no loading state at all
- Loading state that shows a small spinner while keeping the previous
  results visible (instead of blanking the list), so it doesn't feel
  like it's stalling
- Full keyboard navigation (arrow up/down, enter to select, escape to
  close) following the combobox pattern
- Matched text highlighted in the results
- Empty states: before typing anything, and "no results found" after a
  search comes back empty

## Why it should feel fast (the <200ms perceived latency part)
- Typing itself never blocks, it's a plain controlled input
- The debounce delay is short (200ms) and only delays the network call,
  not the UI updating
- Cache hit = instant, no spinner at all
- Cache miss = old results stay on screen with a small loading indicator
  instead of clearing to a blank state, so it never looks "broken"
  while waiting

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
