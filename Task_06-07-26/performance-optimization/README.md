# Performance Optimization Challenge

Small full stack app used to practice the 4 optimizations asked for:
virtual scrolling, code splitting, memoization, and bundle size reduction.

## Structure

```
backend/   - express api, serves 12000 mock items
frontend/  - vite + react app that renders the list
```

## Running it

```
cd backend
npm install
npm start
# runs on http://localhost:5000

cd frontend
npm install
npm run dev
# runs on http://localhost:5173
```

## What was slow originally

The starting point was a typical "just get it working" React list page:

- all 12000 rows rendered into the DOM at once (no windowing)
- a `SlowList` component with no `memo`, so every row re-rendered on
  every keystroke in the search box (kept in `frontend/src/legacy/SlowList.jsx`
  for reference, not used by the app)
- one route file, so the whole app (list page + detail page + about page)
  loaded on first visit
- `react-router-dom`, `lodash`, and `moment` pulled in for things the app
  barely used

## What was changed

**1. Virtual scrolling**
`components/VirtualList.jsx` uses `react-window`'s `FixedSizeList`. Instead
of mounting all 12000 rows, it only mounts the rows currently visible in
the 600px viewport (about 12-18 rows) plus a small overscan buffer. Scroll
position just shifts which slice of `items` gets rendered.

**2. Code splitting**
`App.jsx` loads `Home`, `ItemDetail`, and `About` with `React.lazy` +
`Suspense`, so each page is its own JS chunk and only downloads when that
route is visited, instead of shipping every page on first load.

**3. Memoization**
- `components/Row.jsx` is wrapped in `React.memo`, so a row only
  re-renders when its own `item` reference changes, not when the parent
  re-renders for an unrelated reason (typing in the search box, etc.)
- `pages/Home.jsx` wraps the search filtering in `useMemo`, so filtering
  12000 items only re-runs when `items` or `search` actually change.

**4. Bundle size**
- Dropped `react-router-dom` for a ~30 line custom router
  (`src/router.jsx`) — this app only has 3 routes, so a full routing
  library wasn't paying for itself.
- Dropped `lodash` and `moment`, which weren't doing anything the app
  couldn't do with plain JS.
- Added `manualChunks` in `vite.config.js` to split vendor code
  (react/react-dom) from app code, so vendor code can be cached
  separately across deploys.
- Added `rollup-plugin-visualizer` so `dist/stats.html` shows exactly
  what's in the bundle after a build.

## Measured results

Built with `npm run build` on both versions (naive version was a temporary
branch with the same UI, eager imports, `react-router-dom` + `lodash` +
`moment`, and no windowing — not shipped in this repo, numbers below are
from that build).

| | Before | After (initial load: index + vendor + Home chunk) |
|---|---|---|
| JS (raw, minified) | 300.6 kB | 155.9 kB |
| JS (gzip) | 101.1 kB | 51.2 kB |

That's about a **48% reduction** in gzip size on first load. Visiting
`/about` or an item detail page adds another 0.3-0.7 kB chunk on demand,
instead of that code being in everyone's initial download.

For the rendering side, the practical difference is: scrolling the
12000-item list stayed smooth (DOM only ever has ~15-20 row elements at a
time), versus the naive version which mounted all 12000 divs up front and
noticeably lagged when typing in the search box, since every row
re-rendered on each keystroke.

## Notes

- `backend` is intentionally minimal — two GET routes and an in-memory
  array, no database. It's there to actually serve 12000+ items over
  a real HTTP request rather than importing a JSON file into the
  frontend bundle.
- `frontend/src/legacy/SlowList.jsx` is unused dead code, only kept so the
  before/after is easy to see in one repo instead of two.
