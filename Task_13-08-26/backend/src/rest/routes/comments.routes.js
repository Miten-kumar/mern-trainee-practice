const express = require('express');
const db = require('../../db/data');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:postId/comments', requireAuth, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });
    const post = await db.getPostById(req.dbStats, req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comment = await db.createComment(req.dbStats, {
      postId: req.params.postId,
      authorId: req.user.id,
      text,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
