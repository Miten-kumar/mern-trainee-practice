const { createDbStats } = require('../db/simulateDb');

// Gives each REST request its own query counter, same idea as the GraphQL
// context. We patch res.json so the header goes out WITH the response
// (setting it after 'finish' would be too late - headers are already sent
// by then). This lets the perf script compare REST's query count per
// request against GraphQL's single-request count.
function attachDbStats(req, res, next) {
  req.dbStats = createDbStats();

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    res.set('X-DB-Query-Count', String(req.dbStats.getCount()));
    return originalJson(body);
  };

  next();
}

module.exports = { attachDbStats };
