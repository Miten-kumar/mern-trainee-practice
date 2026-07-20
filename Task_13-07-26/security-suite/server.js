const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { connectRedis } = require("./src/redisClient.js");
const { rateLimiter } = require("./src/middleware/rateLimiter.js");
const { sanitizeInput } = require("./src/middleware/sanitize.js");
const { issueCsrfToken, requireCsrfToken } = require("./src/middleware/csrf.js");
const usersRouter = require("./src/routes/users.js");

const app = express();

// helmet sets a bunch of security-related headers in one go - the
// defaults cover most of what you'd want (no clickjacking via iframes,
// no mime-sniffing, hides that this is even an express app, etc).
// contentSecurityPolicy is off by default here since it needs to be
// tailored per-app or it just breaks things - a real app would define
// its own policy instead of using this shortcut
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(sanitizeInput);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// frontend calls this first to get a csrf token before doing anything
// that changes data
app.get("/api/csrf-token", issueCsrfToken);

// rate limit the search endpoint a bit looser than writes, and require
// csrf + tighter rate limiting on anything that changes data
app.use(
  "/api",
  rateLimiter({ windowSeconds: 60, maxRequests: 30 }),
  (req, res, next) => {
    // only enforce csrf on state-changing methods, GET requests don't need it
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return requireCsrfToken(req, res, next);
    }
    next();
  },
  usersRouter
);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectRedis();
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

start();
