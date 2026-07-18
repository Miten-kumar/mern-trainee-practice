interface Props {
  title: string;
  price: number;
  inStock: boolean;
  image: string;
  onAddToCart: () => void;
}

export default function ProductCard({
  title,
  price,
  inStock,
  image,
  onAddToCart,
}: Props) {
  return (
    <div className="product-card">
      <img
        src={image || "https://picsum.photos/300"}
        alt={title}
      />

      <h2>{title}</h2>

      <p className="price">${price}</p>

      <p className={inStock ? "success" : "error"}>
        {inStock ? "In Stock" : "Out Of Stock"}
      </p>

      <button
        disabled={!inStock}
        onClick={onAddToCart}
      >
        {inStock ? "Add To Cart" : "Unavailable"}
      </button>
    </div>
  );
}