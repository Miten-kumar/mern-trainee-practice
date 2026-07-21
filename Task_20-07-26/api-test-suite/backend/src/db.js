const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const path = require("path");

// pass ":memory:" for tests (fresh, isolated, thrown away after), or a
// real file path for actually running the app. tests never touch a
// shared file, so one test can't leave leftover data for the next one.
function createDb(location = ":memory:") {
  if (location !== ":memory:") {
    fs.mkdirSync(path.dirname(location), { recursive: true });
  }

  const db = new DatabaseSync(location);
  runMigrations(db);
  return db;
}

function runMigrations(db) {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // filenames are numbered so this runs them in order

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    db.exec(sql);
  }
}

module.exports = { createDb };
