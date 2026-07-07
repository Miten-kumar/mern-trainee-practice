import { FixedSizeList } from "react-window";
import Row from "./Row.jsx";

// react-window only mounts the rows that are actually visible
// (plus a small overscan buffer), instead of all 12000 rows at once
export default function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={items.length}
      itemSize={48}
      overscanCount={6}
    >
      {({ index, style }) => <Row item={items[index]} style={style} />}
    </FixedSizeList>
  );
}
