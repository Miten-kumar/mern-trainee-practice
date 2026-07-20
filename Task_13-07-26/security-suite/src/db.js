const { DatabaseSync } = require("node:sqlite");

// in-memory db, just for this demo - resets every time the server restarts
const db = new DatabaseSync(":memory:");

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);

const insert = db.prepare("INSERT INTO users (username, email) VALUES (?, ?)");
insert.run("alice", "alice@example.com");
insert.run("bob", "bob@example.com");
insert.run("admin", "admin@example.com");

module.exports = db;
