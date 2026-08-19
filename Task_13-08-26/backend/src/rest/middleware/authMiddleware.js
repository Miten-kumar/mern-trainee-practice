const { userFromAuthHeader } = require('../../auth/auth');

// Attaches req.user if a valid token is present. Does NOT reject the request -
// some routes are public, some need auth. Use `requireAuth` for the latter.
function attachUser(req, res, next) {
  req.user = userFromAuthHeader(req.headers.authorization);
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

module.exports = { attachUser, requireAuth };
