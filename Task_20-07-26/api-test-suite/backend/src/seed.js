const crypto = require("crypto");

function seed(db) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync("password123", salt, 64).toString("hex");

  db.prepare("INSERT OR IGNORE INTO users (email, password_hash) VALUES (?, ?)").run(
    "demo@example.com",
    `${salt}:${hash}`
  );

  const user = db.prepare("SELECT id FROM users WHERE email = ?").get("demo@example.com");

  db.prepare("INSERT INTO todos (user_id, title, completed) VALUES (?, ?, ?)").run(
    user.id,
    "try the demo app",
    0
  );
  db.prepare("INSERT INTO todos (user_id, title, completed) VALUES (?, ?, ?)").run(
    user.id,
    "read the readme",
    1
  );

  console.log("seeded demo@example.com / password123 with 2 todos");
}

module.exports = { seed };
