# SecureBlog

A little blog app I used as a sandbox for a security audit challenge — build something with
the usual beginner mistakes baked in, then actually go fix them properly instead of just
writing a report that says "use parameterized queries" and calling it a day.

So this repo is the *after*. The code has the fixes in it, and `/docs` has the paper trail —
what was wrong, why it mattered, how I fixed it — so it reads less like "trust me" and more
like something you could actually hand to a reviewer.

## Stack

- **Backend:** Node + Express, SQLite (`better-sqlite3`) so there's nothing to install to
  try it out, JWT auth sitting in an httpOnly cookie instead of the browser's JS-reachable
  storage.
- **Frontend:** React + Vite, plain fetch calls, no state management library because the
  app genuinely doesn't need one.

## Layout

```
security-audit-project/
├── backend/
│   ├── src/
│   │   ├── config/          # db connection + schema, helmet/CORS setup
│   │   ├── controllers/     # route handlers, thin
│   │   ├── middleware/      # auth, csrf, rate limiting, validation, error handling
│   │   ├── models/          # all the DB access — every query here is parameterized
│   │   ├── routes/          # wires middleware onto controllers
│   │   ├── utils/           # sanitizer, logger
│   │   └── app.js
│   ├── tests/
│   │   └── security.test.js # so nobody quietly undoes one of these fixes later
│   ├── server.js             # refuses to boot without real secrets set
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # PostCard, LoginForm
│   │   ├── pages/            # Feed
│   │   ├── services/         # api.js — fetch wrapper + CSRF token handling
│   │   ├── utils/            # sanitize.js, DOMPurify pass at render time too
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── docs/
│   ├── SECURITY_AUDIT_REPORT.md
│   ├── SECURITY_CHECKLIST.md
│   ├── DEPENDENCY_SCAN.md
│   └── VULNERABLE_CODE_REFERENCE.md
└── README.md
```

## Running it

```bash
# backend
cd backend
cp .env.example .env        # then actually fill in JWT_SECRET / CSRF_SECRET / COOKIE_SECRET
npm install
npm run dev                 # localhost:4000

# frontend — separate terminal
cd frontend
cp .env.example .env
npm install
npm run dev                 # localhost:5173
```

`cd backend && npm test` runs the regression tests, which is really just a handful of
assertions that pin the fixes down (rejects the classic `' OR '1'='1` login payload, blocks
an unauthenticated CSRF-less POST, checks the CSP header is actually there, etc).

## What was actually wrong with it

The long version with severity ratings and OWASP mappings is in
`docs/SECURITY_AUDIT_REPORT.md`. The short version, because I know most people skim:

- **SQL injection everywhere.** Login and search both built queries with template literals.
  `admin' -- ` as a username logged you in as admin. Rewrote everything to use
  prepared statements — the actual fix, not "escaping quotes and hoping."
- **Stored XSS.** Post and comment bodies got rendered with `dangerouslySetInnerHTML` and
  nothing sanitized them first. A comment with an `onerror` payload would run for anyone who
  scrolled past it. Now it's sanitized on the way in *and* on the way out, plus a CSP that
  won't execute inline scripts even if something slips through both of those.
- **No CSRF protection at all.** Any page on the internet could submit a delete-my-post
  request on a logged-in user's behalf and the cookie would just... go along with it. Added
  double-submit CSRF tokens on every state-changing route.
- **The classic IDOR.** Delete-post checked that you were logged in, but not that you owned
  the post. Fixed with an ownership check that runs before the delete, not after.
- **JWT in localStorage.** Convenient, and also readable by literally any script that gets
  injected into the page — which, see above, was very possible. Moved to an httpOnly cookie.
- **Register let you pick your own role.** `{ "role": "admin" }` in the request body worked.
  It doesn't read that field at all anymore — every new account is just `user`, full stop.
- **No security headers, no rate limiting, error responses leaking stack traces, and login
  telling you specifically whether the username *or* the password was wrong** (nice for
  attackers doing user enumeration, not nice for anyone else). All addressed — see the audit
  report for specifics on each.

## Why SQLite

Honestly, mostly so nobody has to spin up Postgres just to poke at a demo. The fix pattern
in `models/` — bound parameters instead of string building — is identical if you swap this
for Postgres or MySQL later; the vulnerability was never about which database was on the
other end, it was about how the query string got built.

## What I didn't get to

Being upfront about this rather than pretending the audit was exhaustive:

- No DAST pass (something like OWASP ZAP against a live instance) — this was a source-level
  review, not a live pentest.
- `npm audit` is documented as a command to run but isn't wired into CI here — there's no CI
  in this repo at all yet.
- No MFA. Would want it on the admin role specifically if this ever became a real thing.
- No file uploads, so nothing to say about that whole can of worms.

If I kept going, that's the list I'd work through next, roughly in that order.
