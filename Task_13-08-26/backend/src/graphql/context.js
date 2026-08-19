const { createDbStats } = require('../db/simulateDb');
const { createLoaders } = require('./dataloaders');
const { userFromAuthHeader } = require('../auth/auth');

// Builds one context object per incoming GraphQL request: its own query-stats
// counter, its own DataLoader instances, and whichever user the JWT resolves
// to (or null for anonymous requests). Same auth logic as the REST middleware,
// just wired in one place instead of per-route.
async function buildContext({ req }) {
  const stats = createDbStats();
  return {
    stats,
    loaders: createLoaders(stats),
    user: userFromAuthHeader(req.headers.authorization),
  };
}

module.exports = { buildContext };
