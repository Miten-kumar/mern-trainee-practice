const express = require("express");
const db = require("../db.js");

const router = express.Router();

// SAFE: uses a parameterized query (the ? placeholder). the database
// driver sends the search text as pure data, never as part of the sql
// command itself - so even if someone searches for something like
// "' OR '1'='1" it's just treated as a literal string to match against,
// not as sql syntax that changes what the query does.
router.get("/users/search", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "username query param is required" });
  }

  try {
    const stmt = db.prepare("SELECT id, username, email FROM users WHERE username = ?");
    const results = stmt.all(username);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "search failed" });
  }
});

// THE UNSAFE VERSION, FOR REFERENCE ONLY - never do this, this is just
// here so it's obvious what the difference actually is. building the
// query by concatenating the raw input directly into the sql string
// means user input can change the query's actual structure:
//
//   const query = `SELECT * FROM users WHERE username = '${username}'`;
//   db.exec(query);
//
// searching for   ' OR '1'='1   turns that into:
//   SELECT * FROM users WHERE username = '' OR '1'='1'
// which matches every row instead of none - that's the injection.
// this file never actually runs that query, see the sql-injection test
// for proof the safe version above isn't vulnerable to it.

// mutating route - this is the kind of endpoint csrf protection is
// actually for (anything that changes data). protected in server.js
// with the requireCsrfToken middleware.
router.post("/users", (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "username and email are required" });
  }

  try {
    const stmt = db.prepare("INSERT INTO users (username, email) VALUES (?, ?)");
    const result = stmt.run(username, email);
    res.status(201).json({ id: result.lastInsertRowid, username, email });
  } catch (err) {
    res.status(500).json({ error: "failed to create user" });
  }
});

module.exports = router;
