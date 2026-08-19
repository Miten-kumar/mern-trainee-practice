# Security Checklist

Use this before every release. Items are grouped to roughly match the OWASP Top 10 (2021).
Check items in code review, not just once at launch — several of these regress silently
(e.g. someone adds a new raw SQL query, or a new route forgets the auth middleware).

## A01 — Broken Access Control
- [ ] Every route that reads/writes user-owned data checks ownership (or admin role) server-side
- [ ] No endpoint trusts a `role`, `userId`, or `isAdmin` field sent from the client
- [ ] Auth tokens are stored in `httpOnly` cookies, never `localStorage`/`sessionStorage`
- [ ] CORS allow-list is explicit; no `origin: '*'` with `credentials: true`

## A02 — Cryptographic Failures
- [ ] Passwords hashed with bcrypt/argon2 (cost factor reviewed, not default-and-forget)
- [ ] All secrets loaded from environment/secret manager, never hardcoded or defaulted
- [ ] App refuses to boot if required secrets are missing
- [ ] TLS enforced in production (HSTS header present)

## A03 — Injection
- [ ] Zero string-concatenated SQL anywhere in the codebase — prepared statements only
- [ ] All user input validated server-side (length, format, type) — not just client-side
- [ ] Any HTML rendered from user content is sanitized both on write and on render
- [ ] Request body size is capped

## A04 — Insecure Design
- [ ] Rate limiting / account lockout on authentication endpoints
- [ ] Sensitive actions (delete, role change) require re-authentication or extra confirmation

## A05 — Security Misconfiguration
- [ ] `helmet` (or equivalent) applied with an explicit CSP — no wildcard/`unsafe-inline` for scripts
- [ ] `X-Powered-By` and other framework fingerprints disabled
- [ ] Default/example credentials removed before deploy
- [ ] Verbose error messages / stack traces never reach the client in production

## A06 — Vulnerable and Outdated Components
- [ ] `npm audit` (or equivalent) run in CI on every PR, fails build on high/critical
- [ ] Dependency versions pinned; Dependabot/Renovate enabled
- [ ] Unused dependencies removed

## A07 — Identification and Authentication Failures
- [ ] Login/register return identical generic errors (no user enumeration)
- [ ] Session tokens expire (short-lived access token + refresh, not a forever token)
- [ ] Passwords meet a minimum strength policy, checked server-side

## A08 — Software and Data Integrity Failures
- [ ] CI/CD pipeline doesn't pull unpinned dependencies at build time
- [ ] Any deserialization of user input uses a safe, schema-validated parser

## A09 — Security Logging and Monitoring Failures
- [ ] Auth failures, access-control denials, and 5xx errors are logged with a correlation ID
- [ ] Logs never contain passwords, tokens, or full request bodies
- [ ] Alerting exists for spikes in 401/403/429 responses

## A10 — Server-Side Request Forgery (SSRF)
- [ ] N/A for this app (no server-side outbound requests driven by user input) — revisit if
      a URL-fetching feature (e.g. link previews, webhooks) is added

## CSRF (not a numbered 2021 category, folded into A01, but worth its own line)
- [ ] Every state-changing route (POST/PUT/PATCH/DELETE) requires a CSRF token
- [ ] Cookies set with `SameSite=Strict` or `Lax` as appropriate

## Pre-release
- [ ] `npm audit --production` run on both `frontend/` and `backend/`, zero high/critical
- [ ] Security headers verified with a live request (`curl -I`) against a running instance
- [ ] `.env` confirmed absent from git history (`git log --all -- .env`)
- [ ] This checklist reviewed by someone other than the PR author
