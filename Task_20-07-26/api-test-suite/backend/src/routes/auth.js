const express = require("express");
const crypto = require("crypto");

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function authRoutes(db) {
  const router = express.Router();

  router.post("/register", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "password must be at least 8 characters" });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(409).json({ error: "email already registered" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    const passwordHash = `${salt}:${hash}`;

    const result = db
      .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
      .run(email, passwordHash);

    res.status(201).json({ id: result.lastInsertRowid, email });
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    // same error for "no such user" and "wrong password" on purpose -
    // don't give an attacker a way to tell which one was wrong
    if (!user) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    const [salt, storedHash] = user.password_hash.split(":");
    const hash = hashPassword(password, salt);

    if (hash !== storedHash) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    const token = crypto.randomBytes(24).toString("hex");
    db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, user.id);

    res.json({ token });
  });

  return router;
}

module.exports = authRoutes;
