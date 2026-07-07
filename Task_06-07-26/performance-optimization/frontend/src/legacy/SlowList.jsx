// NOT USED BY THE APP.
// Kept here only to show what the "before optimization" version looked like,
// so the README can compare it against components/VirtualList.jsx + Row.jsx

export default function SlowList({ items }) {
  // renders all 12000 rows into the DOM at once, no windowing
  // no memo on the row markup, every row re-renders on any state change
  // in the parent (e.g. typing in the search box)
  return (
    <div className="slow-list">
      {items.map((item) => (
        <div key={item.id} className="row">
          <span className="row-id">#{item.id}</span>
          <span className="row-title">{item.title}</span>
          <span className="row-category">{item.category}</span>
          <span className="row-price">${item.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
