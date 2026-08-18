import type { Product } from "../types/product.types";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onBuy: () => void;
}

export default function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onBuy,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          {product.name}
        </h2>

        <p className="mt-2 text-2xl font-bold text-slate-900">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>

        <p className="mt-3 text-sm text-slate-500">
          Available Stock:{" "}
          <span className="font-semibold text-slate-700">
            {product.stock}
          </span>
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Inventory Version: {product.version}
        </p>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          disabled={quantity <= 1 || isOutOfStock}
          onClick={() =>
            onQuantityChange(
              Math.max(1, quantity - 1)
            )
          }
          className="rounded-lg border px-4 py-2 font-semibold hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>

        <span className="min-w-10 text-center font-semibold">
          {quantity}
        </span>

        <button
          type="button"
          disabled={
            quantity >= product.stock ||
            isOutOfStock
          }
          onClick={() =>
            onQuantityChange(
              Math.min(
                product.stock,
                quantity + 1
              )
            )
          }
          className="rounded-lg border px-4 py-2 font-semibold hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={isOutOfStock}
        onClick={onBuy}
        className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isOutOfStock
          ? "Out of Stock"
          : "Buy Now"}
      </button>
    </div>
  );
}