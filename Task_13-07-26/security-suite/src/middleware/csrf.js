const crypto = require("crypto");

// double-submit cookie pattern: server hands out a random token as a
// cookie, the frontend has to read that cookie and send the same value
// back in a header on any request that changes data. an attacker's site
// can trick a browser into sending cookies automatically, but it can't
// read the cookie value to put in the header - that's what stops the
// forged request from working.
function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(24).toString("hex");
  res.cookie("csrfToken", token, {
    httpOnly: false, // frontend JS needs to read this to send it back in a header
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ csrfToken: token });
}

function requireCsrfToken(req, res, next) {
  const cookieToken = req.cookies?.csrfToken;
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: "invalid or missing csrf token" });
  }

  next();
}

module.exports = { issueCsrfToken, requireCsrfToken };
