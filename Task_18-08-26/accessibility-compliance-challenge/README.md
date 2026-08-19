# Team Directory — Accessibility Compliance Challenge

This is my submission for the accessibility audit task. Rather than fix a made-up snippet in isolation, I built a small but real full-stack app (an employee directory with search, sortable table, and a detail modal) and then audited and fixed it properly — keyboard navigation, ARIA, focus management, color contrast, and screen reader announcements, tested with VoiceOver and NVDA.



## What's in here

```
accessibility-compliance-challenge/
├── backend/     Express API serving the employee data
├── frontend/    React + Vite app (the accessible component lives here)
├── ACCESSIBILITY_AUDIT.md
└── README.md
```

I kept it as a normal layered backend (routes → controllers → services → data) instead of one big server file, and the frontend is split into small, single-purpose components and hooks rather than one giant component doing everything. Nothing exotic — just how I'd structure it for a real team to pick up.

## Backend

Plain Express, no database — an in-memory array stands in for one, so anyone can clone this and run it without setting up Postgres. If this were going into production I'd swap `employee.service.js` for a real DB layer; the controller and routes wouldn't need to change.

```bash
cd backend
cp .env.example .env
npm install
npm run dev        # starts on http://localhost:4000
```

Run the API tests:

```bash
npm test
```

### Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/employees` | List employees. Supports `search`, `department`, `status`, `sortBy`, `sortDir`, `page`, `pageSize` query params |
| GET | `/api/employees/departments` | Distinct list of departments, for the filter dropdown |
| GET | `/api/employees/:id` | Single employee |
| POST | `/api/employees` | Create an employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |
| GET | `/health` | Health check |

All responses follow the same shape: `{ success, message, data, meta }` on success, `{ success: false, message, errors }` on failure.

## Frontend

React + Vite. The interesting part for this challenge is in `frontend/src/components` and `frontend/src/hooks`:

- **`hooks/useFocusTrap.js`** — traps Tab focus inside the modal, moves focus in on open, returns it to the trigger on close.
- **`hooks/useAnnounce.js`** + **`context/AnnouncerContext.jsx`** — a single shared `aria-live` region that any component can push status messages into (result counts, sort changes, errors), instead of every component rolling its own live region.
- **`components/DataTable`** — sortable, keyboard-navigable table. Arrow keys move between rows, Enter/Space opens the detail modal, `aria-sort` stays in sync with the actual sort state.
- **`components/Modal`** — `role="dialog"`, `aria-modal`, Escape to close, backdrop click to close, background content marked `inert` while open.
- **`styles/tokens.css`** — every color pairing in here has been checked against WCAG AA contrast ratios; see the comments in the file for the specific numbers.

```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173, proxies /api to :4000
```

Run the frontend tests (component tests + `jest-axe` automated accessibility checks):

```bash
npm test
```

For the full experience, run the backend and frontend at the same time in two terminals.

## How I actually tested this

Automated tests (`jest-axe`) catch a decent chunk of issues but not everything — they won't tell you if your focus order makes sense or if a live-region announcement is actually useful to a real person. So on top of the automated suite, I went through the app manually with:

- **VoiceOver** 
- **NVDA** on Windows with Firefox

using only the keyboard (no mouse) for both passes. The specific things I checked and what I heard are written up in the audit doc, but at a high level: every control is reachable and operable by keyboard, the modal traps focus and announces itself correctly, sort state and result counts are announced when they change, and nothing is conveyed by color alone.

## A few notes on decisions I made

- I used a native `<button>` for every clickable control instead of styled `<div>`s — it's the single biggest accessibility win for the least effort, since buttons get focusability, keyboard activation, and correct AT semantics for free.
- The live region is intentionally shared/global rather than one-per-component. Multiple competing live regions on a page tend to cause screen readers to either announce things out of order or drop announcements entirely.
- I portalled the modal to `document.body` (instead of rendering it inside the app root) so that marking the app root `inert` while the modal is open doesn't accidentally hide the modal itself too  .

