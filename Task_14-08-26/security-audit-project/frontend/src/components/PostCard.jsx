import { sanitize } from '../utils/sanitize';

/**
 * BEFORE (vulnerable, do not reuse):
 *   <div dangerouslySetInnerHTML={{ __html: post.body }} />
 * Rendered whatever was stored, including <script> and onerror= payloads.
 *
 * AFTER: still uses dangerouslySetInnerHTML because we DO want the limited
 * rich-text tags (bold, links, lists) to render — but only after passing
 * through DOMPurify with a strict allow-list, matching the server-side
 * sanitizer. Plain text fields (title, author) are rendered as normal JSX,
 * which React escapes automatically — no dangerouslySetInnerHTML needed
 * there at all.
 */
export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <h2>{post.title}</h2>
      <p className="post-meta">
        by {post.author} &middot; {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: sanitize(post.body) }}
      />
    </article>
  );
}
