interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Performance Monitor",
    price: "$99",
    image: "/images/performance-monitor-optimized.webp",
  },
  {
    id: 2,
    name: "Analytics Dashboard",
    price: "$149",
    image: "/images/analytics-dashboard-optimized.webp",
  },
  {
    id: 3,
    name: "Optimization Toolkit",
    price: "$199",
    image: "/images/optimization-toolkit-optimized.webp",
  },
];

const ProductList = () => {
  return (
    <section
      className="products"
      aria-labelledby="products-title"
    >
      <div className="container">
        <h2 id="products-title">Products</h2>

        <div className="product-grid">
          {products.map((product) => (
            <article
              key={product.id}
              className="product-card"
            >
              <img
                src={product.image}
                alt={`${product.name} product`}
                className="product-image"
                width="330"
                height="247"
                loading="lazy"
                decoding="async"
              />

              <h3>{product.name}</h3>

              <p>{product.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;