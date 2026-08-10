import { Prisma, } from "@prisma/client";
import { prisma, } from "../config/prisma";
import { CreateOrderInput, } from "../types/order.types";
import { deductStock, } from "./inventory.service";
import { processPayment, } from "./payment.service";


export async function createOrder(
  input: CreateOrderInput
) {

  return prisma.$transaction(
    async (tx) => {

      /*
       * 1. Validate products
       */

      let totalAmount =
        new Prisma.Decimal(0);

      const items = [];

      for (const item of input.items) {

        const product =
          await tx.product.findUnique({
            where: {
              id: item.productId,
            },
          });

        if (!product) {
          throw new Error(
            `Product ${item.productId} not found`
          );
        }

        /*
         * Check stock
         */

        if (
          product.stock <
          item.quantity
        ) {
          throw new Error(
            `Insufficient stock for ${product.name}`
          );
        }

        /*
         * Calculate total
         */

        totalAmount =
          totalAmount.plus(
            product.price.mul(
              item.quantity
            )
          );

        items.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          version: product.version,
        });
      }

      /*
       * 2. Create Order
       */

      const order =
        await tx.order.create({
          data: {
            userId: input.userId,
            totalAmount,
            status: "PENDING",
          },
        });

      /*
       * 3. Deduct Inventory
       *    + Optimistic Locking
       */

      for (const item of items) {

        await deductStock(
          tx,
          item.productId,
          item.quantity,
          item.version
        );

        /*
         * 4. Create Order Item
         */

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      /*
       * 5. Process Payment
       */

      await processPayment(
        tx,
        order.id,
        totalAmount
      );

      /*
       * 6. Confirm Order
       */

      const confirmedOrder =
        await tx.order.update({
          where: {
            id: order.id,
          },

          data: {
            status: "CONFIRMED",
          },

          include: {
            items: true,
            payment: true,
          },
        });

      /*
       * 7. Return result
       */

      return confirmedOrder;
    },

    {
      /*
       * Strongest standard
       * transaction isolation.
       */

      isolationLevel:
        Prisma.TransactionIsolationLevel.Serializable,

      /*
       * Maximum time waiting
       * for transaction slot.
       */

      maxWait: 5000,

      /*
       * Maximum transaction duration.
       */

      timeout: 10000,
    }
  );
}