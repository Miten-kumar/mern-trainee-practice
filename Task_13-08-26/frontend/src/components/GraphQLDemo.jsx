import { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

const FEED_QUERY = gql`
  query Feed {
    posts {
      id
      title
      author {
        name
      }
      comments {
        id
      }
    }
  }
`;

// Same screen as RestDemo, one query. Apollo Client's fetchPolicy here is
// left at the default (cache-first) - that caching is itself one of the
// practical wins GraphQL clients bring that plain REST fetches don't get
// for free.
export default function GraphQLDemo() {
  const [runQuery, { data, loading, error }] = useLazyQuery(FEED_QUERY, {
    fetchPolicy: 'network-only',
  });
  const [ms, setMs] = useState(null);

  async function load() {
    const start = performance.now();
    await runQuery();
    setMs(Math.round(performance.now() - start));
  }

  return (
    <div className="panel">
      <h2>GraphQL</h2>
      <div className="button-row">
        <button onClick={load} disabled={loading}>
          Load feed (1 query, DataLoader batched)
        </button>
      </div>

      {ms !== null && <p className="stats">1 HTTP request · {ms}ms</p>}
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error.message}</p>}

      {data && (
        <ul className="post-list">
          {data.posts.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <div className="meta">by {post.author.name}</div>
              {post.comments.length > 0 && <div className="meta">{post.comments.length} comments</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
