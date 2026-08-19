const Post = require('../models/Post');
const { sanitizeHtml } = require('../utils/sanitize');

function list(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    res.json({ posts: Post.list(limit, offset) });
  } catch (err) {
    next(err);
  }
}

function search(req, res, next) {
  try {
    const q = String(req.query.q || '').trim().slice(0, 100);
    if (!q) return res.json({ posts: [] });
    res.json({ posts: Post.search(q) });
  } catch (err) {
    next(err);
  }
}

function getOne(req, res, next) {
  try {
    const post = Post.get(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json({ post, comments: Post.listComments(post.id) });
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const { title, body } = req.body;
    const clean = sanitizeHtml(body); // strip any script/event-handler payloads before storing
    const result = Post.create(req.user.id, title, clean);
    res.status(201).json({ post: Post.get(result.lastInsertRowid) });
  } catch (err) {
    next(err);
  }
}

function remove(req, res, next) {
  try {
    // Ownership already verified by requireOwnershipOrAdmin middleware,
    // but we still scope the DELETE by author_id as defense-in-depth
    // (see models/Post.js).
    const result = Post.remove(req.params.id, req.user.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Post not found.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getPostOwnerId(req) {
  const post = Post.get(req.params.id);
  return post ? post.author_id : null;
}

function addComment(req, res, next) {
  try {
    const clean = sanitizeHtml(req.body.body);
    Post.addComment(req.params.id, req.user.id, clean);
    res.status(201).json({ comments: Post.listComments(req.params.id) });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, search, getOne, create, remove, addComment, getPostOwnerId };
