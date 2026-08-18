import { useState } from "react";
import { useForm, } from "react-hook-form";
import { zodResolver, } from "@hookform/resolvers/zod";
import { orderSchema, type OrderFormData, } from "../schemas/order.schema";
import { createOrder, } from "../api/order.api";
import type { Order, } from "../types/order.types";


interface OrderFormProps {
  productId: number;
  productName: string;
  price: string;
  stock: number;
  onSuccess: (order: Order) => void;
}

export default function OrderForm({
  productId,
  productName,
  price,
  stock,
  onSuccess,
}: OrderFormProps) {
  const [serverError, setServerError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),

    defaultValues: {
      userId: 1,
      productId,
      quantity: 1,
    },
  });

  async function onSubmit(
    data: OrderFormData
  ) {
    try {
      setServerError("");

      const order =
        await createOrder({
          userId: data.userId,

          items: [
            {
              productId: data.productId,
              quantity: data.quantity,
            },
          ],
        });

      onSuccess(order);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Order creation failed:",
        error
      );

      const message =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        "Order failed. Please try again.";

      setServerError(message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border bg-white p-8 shadow-sm"
    >
      <div className="mb-6 border-b pb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {productName}
        </h2>

        <p className="mt-2 text-2xl font-bold">
          ₹{Number(price).toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Available stock: {stock}
        </p>
      </div>

      {/* User ID */}
      <div className="mb-5">
        <label
          htmlFor="userId"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          User ID
        </label>

        <input
          id="userId"
          type="number"
          {...register("userId", {
            valueAsNumber: true,
          })}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        {errors.userId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.userId.message}
          </p>
        )}
      </div>

      {/* Product ID */}
      <input
        type="hidden"
        {...register("productId", {
          valueAsNumber: true,
        })}
      />

      {/* Quantity */}
      <div className="mb-5">
        <label
          htmlFor="quantity"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Quantity
        </label>

        <input
          id="quantity"
          type="number"
          min={1}
          max={stock}
          {...register("quantity", {
            valueAsNumber: true,
          })}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">
            {errors.quantity.message}
          </p>
        )}
      </div>

      {/* Backend error */}
      {serverError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">
            Transaction Failed
          </p>

          <p className="mt-1 text-sm text-red-600">
            {serverError}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || stock === 0}
        className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Processing Transaction..."
          : "Place Order"}
      </button>
    </form>
  );
}