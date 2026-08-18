import { Prisma } from "@prisma/client";

import { prisma } from "../src/config/prisma";

import {
  deductStock,
} from "../src/services/inventory.service";

describe("Optimistic Locking", () => {

  let productId: number;

  beforeAll(async () => {
    await prisma.$connect();

    const product =
      await prisma.product.create({
        data: {
          name: "Optimistic Lock Laptop",
          price: 50000,
          stock: 5,
          version: 0,
        },
      });

    productId = product.id;
  });

  afterAll(async () => {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    await prisma.$disconnect();
  });

  it("should reject update when version is stale", async () => {

    /*
     * Current database state
     *
     * stock = 5
     * version = 0
     */

    await prisma.product.update({
      where: {
        id: productId,
      },

      data: {
        stock: {
          decrement: 1,
        },

        version: {
          increment: 1,
        },
      },
    });

    /*
     * Database is now:
     *
     * stock = 4
     * version = 1
     *
     * But request still has version 0.
     */

    await expect(
      prisma.$transaction(
        async tx => {

          await deductStock(
            tx,
            productId,
            1,

            // stale version
            0
          );
        },

        {
          isolationLevel:
            Prisma.TransactionIsolationLevel.Serializable,
        }
      )
    ).rejects.toThrow(
      "Stock changed or insufficient inventory"
    );

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    expect(product?.stock).toBe(4);
    expect(product?.version).toBe(1);
  });
});