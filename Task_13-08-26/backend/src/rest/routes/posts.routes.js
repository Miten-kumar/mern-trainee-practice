const express = require('express');
const db = require('../../db/data');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Naive list endpoint: returns posts with only authorId, no author details,
// no comments. A client that wants author name + comment count for a feed
// has to fire off extra requests per post - this is the N+1 shape.
router.get('/', async (req, res, next) => {
  try {
    const posts = await db.getAllPosts(req.dbStats);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// Hand-built "optimized" feed endpoint: joins author + comment count
// server-side so the client gets one response. This is the usual REST fix
// for N+1 - and it's also how you end up with a growing pile of
// purpose-built endpoints (endpoint sprawl) as new screens need new shapes.
router.get('/feed', async (req, res, next) => {
  try {
    const posts = await db.getAllPosts(req.dbStats);
    const feed = await Promise.all(
      posts.map(async (post) => {
        const [author, commentCount] = await Promise.all([
          db.getUserById(req.dbStats, post.authorId),
          db.getCommentCountByPostId(req.dbStats, post.id),
        ]);
        return { ...post, author, commentCount };
      })
    );
    res.json(feed);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await db.getPostById(req.dbStats, req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await db.getCommentsByPostId(req.dbStats, req.params.id);
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'title and body are required' });
    const post = await db.createPost(req.dbStats, { authorId: req.user.id, title, body });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
