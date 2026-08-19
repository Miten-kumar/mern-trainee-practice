/**
 * Post + comment data access.
 *
 * AUDIT NOTE (finding SEC-01b): the original search endpoint concatenated
 * the query string directly into a LIKE clause:
 *   `SELECT * FROM posts WHERE title LIKE '%${q}%'`
 * A payload like  %' UNION SELECT username,password_hash,... FROM users--
 * exfiltrated password hashes through the search box. Fixed below with a
 * bound parameter and the wildcard characters added in JS, not SQL.
 */

const db = require('../config/db');

const insertPost = db.prepare(
  'INSERT INTO posts (author_id, title, body) VALUES (?, ?, ?)'
);
const listPosts = db.prepare(
  `SELECT posts.id, posts.title, posts.body, posts.created_at,
          users.username AS author
   FROM posts JOIN users ON users.id = posts.author_id
   ORDER BY posts.created_at DESC LIMIT ? OFFSET ?`
);
const getPost = db.prepare(
  `SELECT posts.id, posts.title, posts.body, posts.created_at, posts.author_id,
          users.username AS author
   FROM posts JOIN users ON users.id = posts.author_id
   WHERE posts.id = ?`
);
const searchPosts = db.prepare(
  `SELECT id, title, body, created_at FROM posts
   WHERE title LIKE ? ESCAPE '\\' LIMIT 20`
);
const deletePost = db.prepare('DELETE FROM posts WHERE id = ? AND author_id = ?');

const insertComment = db.prepare(
  'INSERT INTO comments (post_id, author_id, body) VALUES (?, ?, ?)'
);
const listComments = db.prepare(
  `SELECT comments.id, comments.body, comments.created_at, users.username AS author
   FROM comments JOIN users ON users.id = comments.author_id
   WHERE post_id = ? ORDER BY comments.created_at ASC`
);

// Escape LIKE metacharacters so a search for "50% off" or a literal
// underscore doesn't behave as a SQL wildcard — a correctness fix that
// also closes off a minor injection-adjacent quirk in LIKE patterns.
function escapeLike(input) {
  return input.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

module.exports = {
  create: (authorId, title, body) => insertPost.run(authorId, title, body),
  list: (limit = 20, offset = 0) => listPosts.all(limit, offset),
  get: (id) => getPost.get(id),
  search: (q) => searchPosts.all(`%${escapeLike(q)}%`),
  remove: (id, authorId) => deletePost.run(id, authorId),
  addComment: (postId, authorId, body) => insertComment.run(postId, authorId, body),
  listComments: (postId) => listComments.all(postId),
};
