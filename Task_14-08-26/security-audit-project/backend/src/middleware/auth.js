/**
 * JWT auth middleware.
 *
 * AUDIT NOTE (finding SEC-02): the original app stored the JWT in
 * localStorage and read it from a custom header with no expiry check, and
 * the "requireAdmin" check trusted a `role` field sent by the client in the
 * request body (classic broken access control — A01:2021). Fixed by:
 *   1. Signing/verifying server-side only, short expiry + refresh flow.
 *   2. Reading the token from an httpOnly, Secure, SameSite=Strict cookie
 *      so it's invisible to JS (mitigates XSS token theft).
 *   3. Deriving role from the verified token/DB, never from client input.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role, username: payload.username };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    return next();
  };
}

/**
 * Object-level authorization check for "owns this resource" style routes.
 * Fixes finding SEC-06 (IDOR): the original DELETE /posts/:id endpoint
 * deleted any post by ID with no ownership check, so any logged-in user
 * could delete anyone else's content by guessing sequential IDs.
 */
function requireOwnershipOrAdmin(getOwnerId) {
  return async (req, res, next) => {
    const ownerId = await getOwnerId(req);
    if (ownerId == null) return res.status(404).json({ error: 'Not found.' });
    if (req.user.role !== 'admin' && req.user.id !== ownerId) {
      return res.status(403).json({ error: 'You do not own this resource.' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole, requireOwnershipOrAdmin, User };
