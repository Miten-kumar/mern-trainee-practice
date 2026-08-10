import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getPayment,
} from "../api/payment.api";

import type {
  Payment,
} from "../types/order.types";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function PaymentPage() {
  const { orderId } =
    useParams<{
      orderId: string;
    }>();

  const [
    payment,
    setPayment,
  ] = useState<Payment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadPayment() {
    try {
      setLoading(true);
      setError("");

      const id = Number(orderId);

      if (!id || id <= 0) {
        setError(
          "Invalid order ID."
        );

        return;
      }

      const data =
        await getPayment(id);

      setPayment(data);
    } catch (error) {
      console.error(
        "Failed to load payment:",
        error
      );

      setError(
        "Unable to load payment details."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayment();
  }, [orderId]);

  if (loading) {
    return (
      <Loading message="Loading payment details..." />
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <ErrorMessage
          message={error}
          onRetry={loadPayment}
        />
      </main>
    );
  }

  if (!payment) {
    return null;
  }

  const isSuccess =
    payment.status === "SUCCESS";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        {/* Status */}
        <div className="text-center">
          <div
            className={
              isSuccess
                ? "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600"
                : "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600"
            }
          >
            {isSuccess ? "✓" : "!"}
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Payment{" "}
            {isSuccess
              ? "Successful"
              : "Failed"}
          </h1>

          <p className="mt-2 text-slate-500">
            Payment status:{" "}
            <span
              className={
                isSuccess
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }
            >
              {payment.status}
            </span>
          </p>
        </div>

        {/* Payment Details */}
        <div className="mt-8 space-y-4 rounded-lg bg-slate-50 p-5">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Order ID
            </span>

            <span className="font-semibold">
              #{payment.orderId}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Amount
            </span>

            <span className="font-semibold">
              ₹
              {Number(
                payment.amount
              ).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Status
            </span>

            <span
              className={
                isSuccess
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }
            >
              {payment.status}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">
              Transaction ID
            </span>

            <span className="break-all font-mono text-sm font-semibold">
              {payment.transactionId ??
                "N/A"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </main>
  );
}