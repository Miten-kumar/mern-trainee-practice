import { useState } from 'react';

// Mirrors the "naive" path in the backend perf script: GET /api/posts,
// then GET /api/users/:id and GET /api/posts/:id/comments per post. Renders
// the request count and timing next to the feed so the N+1 cost is visible,
// not just described.
export default function RestDemo() {
  const [posts, setPosts] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadNaive() {
    setLoading(true);
    const start = performance.now();
    let requestCount = 0;

    const postsRes = await fetch('/api/posts');
    requestCount += 1;
    const rawPosts = await postsRes.json();

    const enriched = await Promise.all(
      rawPosts.map(async (post) => {
        const [authorRes, commentsRes] = await Promise.all([
          fetch(`/api/users/${post.authorId}`),
          fetch(`/api/posts/${post.id}/comments`),
        ]);
        requestCount += 2;
        const [author, comments] = await Promise.all([authorRes.json(), commentsRes.json()]);
        return { ...post, author, comments };
      })
    );

    setPosts(enriched);
    setStats({ requestCount, ms: Math.round(performance.now() - start) });
    setLoading(false);
  }

  async function loadOptimized() {
    setLoading(true);
    const start = performance.now();
    const res = await fetch('/api/posts/feed');
    const feed = await res.json();
    setPosts(feed.map((p) => ({ ...p, comments: [] })));
    setStats({ requestCount: 1, ms: Math.round(performance.now() - start), note: 'via hand-built /feed endpoint' });
    setLoading(false);
  }

  return (
    <div className="panel">
      <h2>REST</h2>
      <div className="button-row">
        <button onClick={loadNaive} disabled={loading}>
          Load feed (naive, N+1)
        </button>
        <button onClick={loadOptimized} disabled={loading}>
          Load feed (optimized /feed)
        </button>
      </div>

      {stats && (
        <p className="stats">
          {stats.requestCount} HTTP requests · {stats.ms}ms {stats.note ? `(${stats.note})` : ''}
        </p>
      )}

      {loading && <p>Loading…</p>}

      {posts && (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <div className="meta">by {post.author?.name || post.authorId}</div>
              {post.comments?.length > 0 && <div className="meta">{post.comments.length} comments</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
