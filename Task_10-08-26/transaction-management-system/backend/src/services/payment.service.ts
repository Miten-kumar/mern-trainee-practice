import { Prisma } from "@prisma/client";

export async function processPayment(
  tx: Prisma.TransactionClient,
  orderId: number,
  amount: Prisma.Decimal
) {

  if (
    amount.lessThanOrEqualTo(0)
  ) {
    throw new Error(
      "Invalid payment amount"
    );
  }

  const transactionId =
    `TXN-${Date.now()}-${orderId}`;

  const payment =
    await tx.payment.create({
      data: {
        orderId,
        amount,
        status: "SUCCESS",
        transactionId,
      },
    });

  return payment;
}