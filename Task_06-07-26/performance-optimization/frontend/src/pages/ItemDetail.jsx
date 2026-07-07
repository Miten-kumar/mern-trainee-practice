import { useEffect, useState } from "react";
import { Link } from "../router.jsx";

export default function ItemDetail({ id }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}`)
      .then((res) => res.json())
      .then(setItem)
      .catch((err) => console.error("failed to load item", err));
  }, [id]);

  if (!item) return <div className="page-loading">Loading item...</div>;

  return (
    <div className="page">
      <Link to="/">&larr; back to list</Link>
      <h1>{item.title}</h1>
      <p>Category: {item.category}</p>
      <p>Price: ${item.price.toFixed(2)}</p>
      <p>Stock: {item.stock}</p>
      <p>{item.description}</p>
    </div>
  );
}
