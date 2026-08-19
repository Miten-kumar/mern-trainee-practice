const express = require('express');
const db = require('../../db/data');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await db.getAllUsers(req.dbStats);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.getUserById(req.dbStats, req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Under-fetching in action: to show "this user's posts" a REST client has to
// know this endpoint exists, separate from GET /api/posts.
router.get('/:id/posts', async (req, res, next) => {
  try {
    const posts = await db.getPostsByAuthorId(req.dbStats, req.params.id);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
