// takes the db so the middleware always checks whatever db the app
// was built with - matters for tests, which use a fresh db each time
function requireAuth(db) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "no token provided" });
    }

    const session = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token);
    if (!session) {
      return res.status(401).json({ error: "invalid or expired token" });
    }

    req.userId = session.user_id;
    next();
  };
}

module.exports = requireAuth;
