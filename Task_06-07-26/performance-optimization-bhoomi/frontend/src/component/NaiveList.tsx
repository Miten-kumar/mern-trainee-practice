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

const NaiveList = ({ items }: Props) => {
  return (
    <div>
      {items.map((item) => (
        <ItemCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default NaiveList;