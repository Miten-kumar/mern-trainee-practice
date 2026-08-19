/**
 * CSRF protection.
 *
 * AUDIT NOTE (finding SEC-03): all state-changing routes (POST/PUT/DELETE)
 * accepted requests based on cookie auth alone with no origin or token
 * check, so a third-party page could silently submit forms / fetch()
 * requests (credentials: 'include') on a logged-in user's behalf.
 *
 * Fix: double-submit-cookie CSRF token via the `csrf-csrf` package.
 *   - GET /api/csrf-token issues a token tied to a signed cookie.
 *   - The SPA reads it and sends it back in the X-CSRF-Token header on
 *     every mutating request; the middleware verifies cookie === header.
 *   - Combined with SameSite=Strict cookies and strict CORS as
 *     defense-in-depth (belt and braces, not a substitute for the token).
 */

const { doubleCsrf } = require('csrf-csrf');

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: '__Host-csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  size: 64,
  getSessionIdentifier: (req) => req.cookies?.access_token || 'anonymous',
});

function issueCsrfToken(req, res) {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
}

module.exports = { doubleCsrfProtection, issueCsrfToken };
