import { useEffect, useState, } from "react";
import { Link, useSearchParams, } from "react-router-dom";
import { getProductById, } from "../api/product.api";
import type { Product, } from "../types/product.types";
import type { Order, } from "../types/order.types";

import OrderForm from "../components/OrderForm";
import OrderSummary from "../components/OrderSummary";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function OrderPage() {
  const [searchParams] =
    useSearchParams();

  const productId = Number(
    searchParams.get("productId")
  );

  const [product, setProduct] =
    useState<Product | null>(null);

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      if (!productId || productId <= 0) {
        setError(
          "Invalid product ID."
        );

        return;
      }

      const data =
        await getProductById(
          productId
        );

      setProduct(data);
    } catch (error) {
      console.error(
        "Failed to load product:",
        error
      );

      setError(
        "Unable to load the selected product."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (loading) {
    return (
      <Loading message="Loading product..." />
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <ErrorMessage
          message={error}
          onRetry={loadProduct}
        />

        <div className="mt-5 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  /*
   * Transaction completed successfully.
   */
  if (order) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <OrderSummary order={order} />

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {/* Back */}
      <Link
        to="/"
        className="text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        ← Back to Products
      </Link>

      {/* Header */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-bold text-slate-900">
          Place Order
        </h1>

        <p className="mt-2 text-slate-500">
          Complete the transaction below.
        </p>
      </div>

      {/* Product Information */}
      <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          {product.name}
        </h2>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-slate-500">
            Price
          </span>

          <span className="text-xl font-bold">
            ₹
            {Number(
              product.price
            ).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-slate-500">
            Available Stock
          </span>

          <span className="font-semibold">
            {product.stock}
          </span>
        </div>
      </div>

      {/* Order Form */}
      <OrderForm
        productId={product.id}
        productName={product.name}
        price={product.price}
        stock={product.stock}
        onSuccess={setOrder}
      />
    </main>
  );
}