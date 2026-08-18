import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../api/product.api";

import type { Product } from "../types/product.types";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);

      setError(
        "Unable to load products. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, []);

  if (loading) {
    return (
      <Loading message="Loading products..." />
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <ErrorMessage
          message={error}
          onRetry={loadProducts}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Products
        </h1>

        <p className="mt-2 text-slate-500">
          Select a product and place an order.
        </p>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold">
            No products available
          </h2>

          <p className="mt-2 text-slate-500">
            Please add products to the database.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const outOfStock =
              product.stock === 0;

            return (
              <div
                key={product.id}
                className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Stock
                    </span>

                    <span
                      className={
                        outOfStock
                          ? "font-semibold text-red-600"
                          : "font-semibold text-green-600"
                      }
                    >
                      {product.stock}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Version
                    </span>

                    <span className="font-medium text-slate-700">
                      {product.version}
                    </span>
                  </div>
                </div>

                {outOfStock ? (
                  <button
                    disabled
                    className="mt-6 w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 py-3 font-semibold text-slate-500"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <Link
                    to={`/order?productId=${product.id}`}
                    className="mt-6 block w-full rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:bg-slate-700"
                  >
                    Buy Now
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}