// no real database for this challenge, just an in-memory array.
// the point of the task is the caching layer, not the storage itself.
export let products = [
  { id: 1, name: "Wireless Mouse", price: 799, stock: 50 },
  { id: 2, name: "Mechanical Keyboard", price: 2999, stock: 30 },
  { id: 3, name: "USB-C Hub", price: 1299, stock: 100 },
];

let nextId = 4;

// pretend this is a slow query - this delay is what makes a cache
// stampede actually visible/testable (see cacheLock.js)
export function fetchProductsFromDB() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 800);
  });
}

export function addProduct(data) {
  const product = { id: nextId++, ...data };
  products.push(product);
  return product;
}

export function updateProduct(id, data) {
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  products[index] = { ...products[index], ...data };
  return products[index];
}

export function deleteProduct(id) {
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}
