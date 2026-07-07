import { memo } from "react";
import { Link } from "../router.jsx";

// memo stops a row from re-rendering unless its own item data changes
// this matters here because react-window re-renders the visible rows
// on every scroll event, and without memo every row would re-run
// its render function even when its data hasn't changed
function Row({ item, style }) {
  return (
    <div style={style} className="row">
      <span className="row-id">#{item.id}</span>
      <span className="row-title">{item.title}</span>
      <span className="row-category">{item.category}</span>
      <span className="row-price">${item.price.toFixed(2)}</span>
      <Link to={`/items/${item.id}`} className="row-link">
        View
      </Link>
    </div>
  );
}

export default memo(Row, (prev, next) => prev.item === next.item);
