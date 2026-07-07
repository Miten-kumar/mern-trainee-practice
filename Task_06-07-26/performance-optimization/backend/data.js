// generates a fixed list of items once when the server starts
// 12000 items so the list is comfortably above the 10k requirement

const categories = ["Electronics", "Books", "Clothing", "Home", "Sports", "Toys"];

function makeItems(count) {
  const items = [];
  for (let i = 1; i <= count; i++) {
    const category = categories[i % categories.length];
    items.push({
      id: i,
      title: `${category} item #${i}`,
      category,
      price: Math.round((Math.random() * 500 + 5) * 100) / 100,
      stock: Math.floor(Math.random() * 200),
      description:
        `This is a sample description for item ${i}. ` +
        `It belongs to the ${category} category and is used only ` +
        `for testing list rendering performance.`,
    });
  }
  return items;
}

export const ITEMS = makeItems(12000);
