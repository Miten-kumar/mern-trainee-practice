const express = require("express");
const authRoutes = require("./routes/auth.js");
const todosRoutes = require("./routes/todos.js");
const requireAuth = require("./middleware/requireAuth.js");

// takes a db instead of importing one directly - this is the whole
// trick that makes this testable. tests build their own throwaway
// in-memory db and pass it in here, so tests never touch real data
// and never affect each other
function createApp(db) {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRoutes(db));
  app.use("/api/todos", requireAuth(db), todosRoutes(db));

  return app;
}

module.exports = createApp;
