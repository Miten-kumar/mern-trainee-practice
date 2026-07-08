import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import NaiveList from "../component/NaiveList";
import VirtualList from "../component/Virtua;List";

interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
}

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [optimized, setOptimized] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/items");
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const toggleView = useCallback(() => {
    setOptimized((prev) => !prev);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Performance Optimization</h1>

      <input
        type="text"
        placeholder="Search Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "20px",
        }}
      />

      <button onClick={toggleView}>
        {optimized ? "Show Naive List" : "Show Optimized List"}
      </button>

      <hr />

      {optimized ? (
        <VirtualList items={filteredItems} />
      ) : (
        <NaiveList items={filteredItems} />
      )}
    </div>
  );
};

export default Home;