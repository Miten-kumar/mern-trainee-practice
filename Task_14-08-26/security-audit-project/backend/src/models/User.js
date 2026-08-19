/**
 * User data access — all queries use parameterized statements.
 *
 * BEFORE (vulnerable, do not reuse):
 *   const row = db.exec(`SELECT * FROM users WHERE username = '${username}'
 *                         AND password = '${password}'`);
 *   // input: username = admin' -- would bypass the password check entirely.
 *
 * AFTER: bound parameters (?) — the driver treats user input strictly as
 * data, never as SQL syntax, which is the actual fix for injection (not
 * "escaping", which is easy to get wrong).
 */

const db = require('../config/db');

const findByUsername = db.prepare('SELECT * FROM users WHERE username = ?');
const findByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findById = db.prepare(
  'SELECT id, username, email, role, created_at FROM users WHERE id = ?'
);
const insertUser = db.prepare(
  `INSERT INTO users (username, email, password_hash, role)
   VALUES (@username, @email, @passwordHash, @role)`
);
const bumpFailedLogin = db.prepare(
  `UPDATE users SET failed_login_count = failed_login_count + 1,
   locked_until = @lockedUntil WHERE id = @id`
);
const resetFailedLogin = db.prepare(
  'UPDATE users SET failed_login_count = 0, locked_until = NULL WHERE id = ?'
);

module.exports = {
  findByUsername: (username) => findByUsername.get(username),
  findByEmail: (email) => findByEmail.get(email),
  findById: (id) => findById.get(id),
  create: ({ username, email, passwordHash, role = 'user' }) =>
    insertUser.run({ username, email, passwordHash, role }),
  recordFailedLogin: (id, lockedUntil = null) =>
    bumpFailedLogin.run({ id, lockedUntil }),
  clearFailedLogins: (id) => resetFailedLogin.run(id),
};
