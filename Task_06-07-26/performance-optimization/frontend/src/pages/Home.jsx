import { useEffect, useState, useMemo } from "react";
import VirtualList from "../components/VirtualList.jsx";

const API_URL = "http://localhost:5000/api/items";

export default function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => console.error("failed to load items", err));
  }, []);

  // filtering 12000 items on every render would be expensive,
  // useMemo makes it only run again when items or the search text change
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q)
    );
  }, [items, search]);

  if (loading) return <div className="page-loading">Loading items...</div>;

  return (
    <div className="page">
      <h1>Items ({filteredItems.length})</h1>
      <input
        className="search-box"
        type="text"
        placeholder="Search by title or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <VirtualList items={filteredItems} />
    </div>
  );
}
