import type {
  Order,
} from "../types/order.types";

interface OrderSummaryProps {
  order: Order;
}

export default function OrderSummary({
  order,
}: OrderSummaryProps) {
  const paymentStatus =
    order.payment?.status ?? "PENDING";

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>

        <h2 className="mt-4 text-2xl font-bold text-green-600">
          Order Successful
        </h2>

        <p className="mt-2 text-slate-500">
          Your transaction has been completed successfully.
        </p>
      </div>

      <div className="space-y-4 rounded-lg bg-slate-50 p-5">
        <div className="flex justify-between">
          <span className="text-slate-500">
            Order ID
          </span>

          <span className="font-semibold">
            #{order.id}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Order Status
          </span>

          <span className="font-semibold text-green-600">
            {order.status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Total Amount
          </span>

          <span className="font-semibold">
            ₹
            {Number(
              order.totalAmount
            ).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Payment Status
          </span>

          <span
            className={
              paymentStatus === "SUCCESS"
                ? "font-semibold text-green-600"
                : "font-semibold text-red-600"
            }
          >
            {paymentStatus}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">
            Transaction ID
          </span>

          <span className="font-mono text-sm font-semibold">
            {order.payment
              ?.transactionId ?? "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-semibold">
          Order Items
        </h3>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between rounded-lg border p-3"
            >
              <span>
                Product #{item.productId}
              </span>

              <span className="font-medium">
                × {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}