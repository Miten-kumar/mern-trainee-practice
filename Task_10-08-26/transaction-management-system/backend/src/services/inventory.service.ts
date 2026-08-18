import { Prisma } from "@prisma/client";

export async function deductStock(
  tx: Prisma.TransactionClient,
  productId: number,
  quantity: number,
  version: number
): Promise<void> {

  const result =
    await tx.product.updateMany({
      where: {
        id: productId,

        // Optimistic locking
        version,

        // Prevent negative stock
        stock: {
          gte: quantity,
        },
      },

      data: {
        stock: {
          decrement: quantity,
        },

        version: {
          increment: 1,
        },
      },
    });

  if (result.count === 0) {
    throw new Error(
      "Stock changed or insufficient inventory"
    );
  }
}