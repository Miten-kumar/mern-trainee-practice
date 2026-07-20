# Production Security Suite

Small Express API demonstrating the core pieces of API security: rate
limiting, security headers, CSRF protection, input sanitization, and
protection against SQL injection. Everything below was actually run and
tested against a live server, not just written.

## Structure

```
server.js                          - wires everything together
src/
  db.js                              - in-memory sqlite, seeded users table
  redisClient.js                       - redis connection
  middleware/
    rateLimiter.js                       - flexible, redis-backed
    csrf.js                                - double-submit cookie pattern
    sanitize.js                              - strips html tags, trims, caps length
  routes/
    users.js                                   - search (safe query) + create (csrf protected)
tests/
  sql-injection.test.js               - fires real injection payloads, checks they fail
  security-headers.test.js              - checks helmet's headers are actually present
```

## Running it

Needs Node 22.5+ (uses the built-in `node:sqlite`, still experimental,
you'll see a warning on startup - that's expected, not a bug) and a
redis instance on `localhost:6379`.

```
npm install
npm start
```

Run the tests against it:
```
npm run test:sqli
npm run test:headers
```

## How each requirement was implemented

**Flexible rate limiter with Redis**
`rateLimiter({ windowSeconds, maxRequests })` is a factory, not a fixed
middleware - call it with different limits per route (a login endpoint
would want a much stricter limit than a search endpoint, for example).
Uses `INCR` + `EXPIRE` in Redis, same fixed-window pattern as a normal
rate limiter. If Redis itself is down, it logs the error and lets the
request through rather than taking the whole API down over it.

**Helmet configuration**
`helmet()` in `server.js` sets the standard set of security headers in
one call - hides `X-Powered-By`, blocks the page from being framed
(clickjacking), stops MIME-sniffing, sets HSTS, etc.
`contentSecurityPolicy` is explicitly turned off with a comment
explaining why: a real CSP needs to be written for the specific app
(what domains you actually load scripts/styles from), a generic default
usually just breaks things.

**CSRF protection**
Double-submit cookie pattern: `GET /api/csrf-token` sets a cookie AND
returns the same value in the response body. Any `POST`/`PUT`/`PATCH`/
`DELETE` request has to send that value back in an `x-csrf-token`
header - `requireCsrfToken` checks the header matches the cookie. An
attacker's site can make a browser send cookies automatically, but it
can't read the cookie's value to put in a header, so a forged
cross-site request fails.

**Input sanitization**
`sanitizeInput` runs on `body`, `query`, and `params` for every request
- strips anything that looks like an HTML tag (basic XSS defense),
trims whitespace, and caps string length at 500 characters so nobody
can dump a huge payload into a small field.

**SQL injection protection**
`GET /api/users/search` uses a parameterized query
(`WHERE username = ?`) instead of building the SQL string by hand. The
route file has a comment showing the unsafe version for contrast (never
actually run, just there to explain the difference) - concatenating
user input directly into a query string lets that input change the
query's structure, which parameterized queries don't allow since the
input is always treated as data, never as part of the SQL command.

## Actual test results

**SQL injection test** - 4 classic payloads (`' OR '1'='1`, a UNION
SELECT attempt, a DROP TABLE attempt, a comment-terminator bypass) fired
at the search endpoint:
```
PASS: "OR 1=1 (classic bypass)" returned 0 results (injection did not work)
PASS: "UNION SELECT attempt" returned 0 results (injection did not work)
PASS: "DROP TABLE attempt" returned 0 results (injection did not work)
PASS: "comment terminator" returned 0 results (injection did not work)
PASS: users table still intact after DROP TABLE attempt, found alice
5 passed, 0 failed
```

**Security headers test**:
```
PASS: "x-content-type-options": nosniff
PASS: "x-frame-options": SAMEORIGIN
PASS: "x-dns-prefetch-control": off
PASS: "strict-transport-security": max-age=15552000; includeSubDomains
PASS: "x-powered-by" header correctly hidden
5 passed, 0 failed
```

**CSRF, manually tested with curl**:
- `POST /api/users` with no token → `403 invalid or missing csrf token`
- same request with the correct token from `/api/csrf-token` → `201 created`
- same request with a wrong/mismatched token → `403` again

**Sanitization, manually tested**:
- sent `username: "<script>alert(1)</script>bob2"` →
  stored as `alert(1)bob2` (tags stripped, not the underlying text - a
  fuller sanitizer would also encode leftover special characters, this
  is the basic version)

**Rate limiting, manually tested**:
- fired 35 requests against a route with `maxRequests: 30` → first 30
  returned `200`, the rest returned `429`
