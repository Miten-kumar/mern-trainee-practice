const DataLoader = require('dataloader');
const db = require('../db/data');

/**
 * DataLoader batches every `.load(id)` call made within the same tick into a
 * single `.loadMany`-style call, and caches results for the lifetime of one
 * request. That's the standard fix for GraphQL's N+1 problem: a naive
 * `Post.author` resolver run once per post would fire one DB call per post;
 * with a loader, all of those `.load(authorId)` calls collapse into ONE
 * `users.findByIds` call, no matter how many posts are on the page.
 *
 * A fresh set of loaders is created per request (see context.js) - sharing
 * loaders across requests would leak cached data between users.
 */
function createLoaders(stats) {
  const userLoader = new DataLoader(async (ids) => {
    const users = await db.getUsersByIds(stats, ids);
    const byId = new Map(users.map((u) => [u.id, u]));
    return ids.map((id) => byId.get(id) || null);
  });

  const commentsByPostLoader = new DataLoader(async (postIds) => {
    return db.getCommentsByPostIds(stats, postIds);
  });

  return { userLoader, commentsByPostLoader };
}

module.exports = { createLoaders };
