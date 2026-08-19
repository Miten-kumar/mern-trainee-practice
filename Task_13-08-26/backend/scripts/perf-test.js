/**
 * Hits the running server three different ways to fetch the same page of
 * data ("all posts, with author name and comments") and prints:
 *   - how many HTTP requests it took
 *   - how many simulated DB queries it took (from X-DB-Query-Count / queryStats)
 *   - how long it took end to end
 *
 * Run `npm start` in one terminal and `npm run perf` in another.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

async function timeIt(label, fn) {
  const start = Date.now();
  const result = await fn();
  const ms = Date.now() - start;
  return { label, ms, ...result };
}

// 1) REST, naive: GET /posts, then GET /users/:id and GET /posts/:id/comments
//    for every post - the textbook N+1 waterfall.
async function restNaive() {
  let requestCount = 0;
  let dbQueryCount = 0;

  const postsRes = await fetch(`${BASE_URL}/api/posts`);
  requestCount += 1;
  dbQueryCount += Number(postsRes.headers.get('x-db-query-count') || 0);
  const posts = await postsRes.json();

  for (const post of posts) {
    const [authorRes, commentsRes] = await Promise.all([
      fetch(`${BASE_URL}/api/users/${post.authorId}`),
      fetch(`${BASE_URL}/api/posts/${post.id}/comments`),
    ]);
    requestCount += 2;
    dbQueryCount += Number(authorRes.headers.get('x-db-query-count') || 0);
    dbQueryCount += Number(commentsRes.headers.get('x-db-query-count') || 0);
    await authorRes.json();
    await commentsRes.json();
  }

  return { requestCount, dbQueryCount, postCount: posts.length };
}

// 2) REST, optimized: a hand-built /posts/feed endpoint that joins
//    author + commentCount server-side. One request, but it only exists
//    because someone anticipated this exact screen.
async function restOptimized() {
  const res = await fetch(`${BASE_URL}/api/posts/feed`);
  const dbQueryCount = Number(res.headers.get('x-db-query-count') || 0);
  const posts = await res.json();
  return { requestCount: 1, dbQueryCount, postCount: posts.length };
}

// 3) GraphQL: one query, shaped exactly like the screen that needs it.
//    DataLoader batches the per-post author + comments lookups server-side.
async function graphql() {
  const query = `
    query Feed {
      posts {
        id
        title
        author { id name }
        comments { id text author { id name } }
      }
    }
  `;
  const res = await fetch(`${BASE_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const { data, extensions } = await res.json();
  return { requestCount: 1, dbQueryCount: extensions.dbQueryCount, postCount: data.posts.length };
}

async function main() {
  console.log(`Comparing against ${BASE_URL} — fetching all posts + author + comments\n`);

  const results = [];
  results.push(await timeIt('REST (naive, N+1)', restNaive));
  results.push(await timeIt('REST (optimized /feed)', restOptimized));
  results.push(await timeIt('GraphQL (single query + DataLoader)', graphql));

  const col = (s, n) => String(s).padEnd(n);
  console.log(col('Approach', 38), col('HTTP requests', 16), col('DB queries', 12), 'Time (ms)');
  console.log('-'.repeat(80));
  for (const r of results) {
    console.log(col(r.label, 38), col(r.requestCount, 16), col(r.dbQueryCount, 12), r.ms);
  }

  console.log(`\n(${results[0].postCount} posts in the seed data. "DB queries" counts simulated`);
  console.log('reads at ~12ms latency each, so request count roughly drives the timing.)');
}

main().catch((err) => {
  console.error('Perf script failed - is the server running? (npm start)');
  console.error(err.message);
  process.exit(1);
});
