/**
 * Client-side render-time sanitization — second layer of XSS defense.
 *
 * AUDIT NOTE (finding SEC-08): even though the backend now sanitizes on
 * write, this component-level pass protects against any content that
 * predates the fix, arrives from a future data source that skips the
 * backend sanitizer, or gets modified directly in the DB. Never trust a
 * single layer for XSS — see docs/SECURITY_AUDIT_REPORT.md.
 */

import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'];

export function sanitize(dirtyHtml) {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  });
}
