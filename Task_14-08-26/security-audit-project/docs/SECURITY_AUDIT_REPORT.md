# Security Audit Report — SecureBlog

**Engagement type:** Internal application security review (white-box, source-available)
**Scope:** `backend/` (Express/Node API) and `frontend/` (React SPA)
**Methodology:** Manual code review against the OWASP Top 10 (2021), plus `npm audit` for
known-vulnerable dependencies. No automated DAST scanner was run against a live instance
for this pass — recommended as a follow-up (see "Not covered" at the end).

**Auditor:** Internal review
**Date:** 2026-08-19
**Overall risk before remediation:** Critical — multiple unauthenticated, unauthenticated-adjacent,
and low-effort exploitation paths (SQLi, stored XSS, CSRF) existed simultaneously.
**Overall risk after remediation:** Low, pending the follow-up items listed at the end.

---

## Summary of findings

| ID | Title | OWASP category | Severity | Status |
|----|-------|-----------------|----------|--------|
| SEC-01 | SQL injection via string-concatenated queries (login, search) | A03:2021 – Injection | Critical | Fixed |
| SEC-02 | JWT stored in localStorage; role read from client body | A01:2021 – Broken Access Control | High | Fixed |
| SEC-03 | No CSRF protection on state-changing routes | A01:2021 – Broken Access Control | High | Fixed |
| SEC-04 | No server-side input validation | A03:2021 – Injection / A08 | Medium | Fixed |
| SEC-05 | Missing security headers (CSP, HSTS, X-Frame-Options, etc.) | A05:2021 – Security Misconfiguration | High | Fixed |
| SEC-06 | IDOR — delete-post endpoint had no ownership check | A01:2021 – Broken Access Control | High | Fixed |
| SEC-07 | No rate limiting on login | A07:2021 – Identification & Auth Failures | Medium | Fixed |
| SEC-08 | Stored XSS via unsanitized post/comment bodies | A03:2021 – Injection | Critical | Fixed |
| SEC-09 | Errors leaked stack traces to clients | A09:2021 – Logging & Monitoring / Info disclosure | Medium | Fixed |
| SEC-10 | User enumeration via distinct login/register error messages | A07:2021 – Identification & Auth Failures | Low | Fixed |
| SEC-11 | Hardcoded fallback secrets if `.env` missing | A02:2021 – Cryptographic Failures | Medium | Fixed |
| SEC-12 | Vulnerable dependencies (see `npm audit` results below) | A06:2021 – Vulnerable & Outdated Components | Varies | Fixed / tracked |

---

## Detailed findings

### SEC-01 — SQL Injection (Critical)
**Where:** `POST /api/auth/login`, `GET /api/posts/search`
**Before:**
```js
db.exec(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);
```
**Impact:** Full authentication bypass (`admin' -- `) and, via the search endpoint, a
`UNION SELECT` could read the `users` table including password hashes — no login required.
**Fix:** All queries rewritten as prepared statements with bound parameters
(`backend/src/models/User.js`, `backend/src/models/Post.js`). Verified with
`backend/tests/security.test.js`.
**Residual risk:** None identified for current query surface. Any new raw SQL added later
must go through the same review — flagged in `docs/SECURITY_CHECKLIST.md`.

### SEC-02 — Insecure token storage & client-controlled role (High)
**Before:** JWT stored in `localStorage`, read via a custom header; `register` accepted a
`role` field from the request body.
**Impact:** Any XSS (see SEC-08) could steal the session token directly from JS-accessible
storage. Any user could self-register as `admin`.
**Fix:** Token now issued as an `httpOnly`, `Secure`, `SameSite=Strict` cookie
(`authController.js`); `role` is hardcoded server-side to `'user'` on registration and is
never read from client input.

### SEC-03 — Cross-Site Request Forgery (High)
**Before:** No CSRF token; cookie-based auth alone authorized POST/PUT/DELETE.
**Impact:** A malicious page could submit a hidden form or `fetch(..., {credentials:'include'})`
to delete a user's posts or post content on their behalf while they were logged in.
**Fix:** Double-submit-cookie CSRF tokens (`csrf-csrf` package) required on every mutating
route, `SameSite=Strict` cookies, and a strict CORS allow-list as defense-in-depth.

### SEC-04 — Missing input validation (Medium)
**Fix:** `express-validator` rules on every write endpoint (`middleware/validators.js`):
length caps, format checks, and a hard 100KB JSON body-size limit at the app level to reduce
trivial payload-based DoS.

### SEC-05 — Missing security headers (High)
**Before:** No `helmet`; default `X-Powered-By: Express` header present.
**Fix:** `helmet` with an explicit CSP (`default-src 'self'`, no `unsafe-inline` scripts),
HSTS with preload, `frameAncestors 'none'`, `referrerPolicy: no-referrer`. See
`backend/src/config/security.js` for the exact policy and rationale per directive.

### SEC-06 — IDOR on delete-post (High)
**Before:** `DELETE /api/posts/:id` deleted any post by ID for any authenticated user.
**Fix:** `requireOwnershipOrAdmin` middleware checks `post.author_id === req.user.id`
(or admin role) before the delete is allowed; the DB query is additionally scoped by
`author_id` as a second layer.

### SEC-07 — No rate limiting (Medium)
**Fix:** `express-rate-limit` on `/api/auth/*` (10 requests / 15 min) and a looser
general API limiter, plus per-account lockout after 5 failed logins
(`User.recordFailedLogin`).

### SEC-08 — Stored XSS (Critical)
**Before:** Post/comment bodies rendered client-side via
`dangerouslySetInnerHTML={{ __html: post.body }}` with no sanitization anywhere in the
pipeline.
**Impact:** A comment containing an `<img onerror=...>` or `<script>` payload executed for
every visitor viewing that post — session-token theft, credential phishing, or defacement,
all with no interaction beyond viewing the page.
**Fix — four layers:**
1. Sanitize on write, server-side (`DOMPurify` in `backend/src/utils/sanitize.js`) with a
   strict tag allow-list.
2. Sanitize again on render, client-side (`frontend/src/utils/sanitize.js`) as
   defense-in-depth.
3. Strict CSP with no `unsafe-inline` for scripts, so even a missed payload can't execute.
4. `httpOnly` cookies (SEC-02) mean a successful script injection still can't read the
   session token.

### SEC-09 — Verbose error responses (Medium)
**Fix:** Centralized error handler returns a generic message + correlation ID for 5xx
errors; full detail (stack trace, path, method) goes only to server-side logs
(`winston`), never to the client.

### SEC-10 — User enumeration (Low)
**Fix:** Login and registration both return an identical, generic error message
regardless of which specific check failed.

### SEC-11 — Insecure secret defaults (Medium)
**Before:** effectively "works" with no `.env` file by falling back to defaults.
**Fix:** `server.js` checks for required env vars at boot and exits with a clear error
instead of starting insecurely. `.env.example` documents every required value; `.env`
itself is git-ignored.

### SEC-12 — Dependency vulnerabilities
See `docs/DEPENDENCY_SCAN.md` for the full `npm audit` output and upgrade notes. All
direct dependencies were pinned to current patched major versions as part of this
remediation; no criticals remained outstanding at time of writing.

---

## Not covered in this pass (recommended follow-ups)

- Automated DAST scan (e.g. OWASP ZAP) against a running instance.
- Secrets scanning in CI (e.g. gitleaks) to catch any future committed credentials.
- Formal threat model / STRIDE pass if the app grows beyond its current scope.
- File upload handling — out of scope, as the current app has no upload feature.
- Multi-factor authentication — recommended for the admin role specifically.
