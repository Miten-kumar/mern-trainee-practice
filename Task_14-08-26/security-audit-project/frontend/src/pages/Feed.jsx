import { useEffect, useState } from 'react';
import { api } from '../services/api';
import PostCard from '../components/PostCard';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    api.listPosts().then((data) => setPosts(data.posts)).catch((e) => setError(e.message));
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    try {
      const data = query.trim() ? await api.searchPosts(query) : await api.listPosts();
      setPosts(data.posts);
    } catch (e2) {
      setError(e2.message);
    }
  }

  return (
    <section>
      <form onSubmit={handleSearch} className="search-form">
        <input
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p role="alert" className="form-error">{error}</p>}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}
