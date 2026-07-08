import { Virtuoso } from "react-virtuoso";
import ItemCard from "./ItemCard";

interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface Props {
  items: Item[];
}

const VirtualList = ({ items }: Props) => {
  return (
    <div style={{ height: "600px" }}>
      <Virtuoso
        style={{ height: "100%" }}
        totalCount={items.length}
        itemContent={(index) => (
          <ItemCard {...items[index]} />
        )}
      />
    </div>
  );
};

export default VirtualList;