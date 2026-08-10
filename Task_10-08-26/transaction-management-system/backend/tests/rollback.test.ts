import { prisma } from "../src/config/prisma";

import { createOrder } from "../src/services/order.service";

import { processPayment } from "../src/services/payment.service";

jest.mock("../src/services/payment.service");

const mockedProcessPayment =
  processPayment as jest.MockedFunction<
    typeof processPayment
  >;

describe("Transaction Rollback", () => {

  let userId: number;
  let productId: number;

  beforeAll(async () => {
    await prisma.$connect();

    const user =
      await prisma.user.create({
        data: {
          name: "Rollback Test User",
          email:
            `rollback-${Date.now()}@test.com`,
        },
      });

    userId = user.id;

    const product =
      await prisma.product.create({
        data: {
          name: "Rollback Laptop",
          price: 50000,
          stock: 5,
          version: 0,
        },
      });

    productId = product.id;
  });

  afterAll(async () => {
    await prisma.payment.deleteMany({
      where: {
        order: {
          userId,
        },
      },
    });

    await prisma.orderItem.deleteMany({
      where: {
        order: {
          userId,
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    await prisma.$disconnect();
  });

  beforeEach(() => {
    mockedProcessPayment.mockRejectedValue(
      new Error("Payment failed")
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should rollback order and inventory when payment fails", async () => {

    const beforeProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    expect(beforeProduct?.stock).toBe(5);
    expect(beforeProduct?.version).toBe(0);

    await expect(
      createOrder({
        userId,
        items: [
          {
            productId,
            quantity: 2,
          },
        ],
      })
    ).rejects.toThrow(
      "Payment failed"
    );

    /*
     * Order should not exist
     */
    const orders =
      await prisma.order.findMany({
        where: {
          userId,
        },
      });

    expect(orders).toHaveLength(0);

    /*
     * Inventory should be restored
     */
    const afterProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    expect(afterProduct?.stock).toBe(5);

    /*
     * Version should also be restored
     */
    expect(afterProduct?.version).toBe(0);

    /*
     * Payment should not exist
     */
    const payments =
      await prisma.payment.findMany();

    expect(
      payments.some(
        payment =>
          payment.orderId ===
          orders[0]?.id
      )
    ).toBe(false);
  });
});