export interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
}

const items: Item[] = [];

for (let i = 1; i <= 10000; i++) {
  items.push({
    id: i,
    name: `Product ${i}`,
    category: `Category ${((i - 1) % 5) + 1}`,
    price: Math.floor(Math.random() * 5000) + 100,
  });
}

export default items;