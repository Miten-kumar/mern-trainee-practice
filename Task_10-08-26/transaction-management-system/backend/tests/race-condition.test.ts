import { prisma } from "../src/config/prisma";
import { createOrder, } from "../src/services/order.service";


describe("Concurrent Order Race Condition", () => {

  let userAId: number;
  let userBId: number;
  let productId: number;

  beforeAll(async () => {
    await prisma.$connect();

    const users =
      await prisma.user.createManyAndReturn({
        data: [
          {
            name: "Race User A",
            email:
              `race-a-${Date.now()}@test.com`,
          },
          {
            name: "Race User B",
            email:
              `race-b-${Date.now()}@test.com`,
          },
        ],
      });

    userAId = users[0].id;
    userBId = users[1].id;

    const product =
      await prisma.product.create({
        data: {
          name: "Race Condition Laptop",
          price: 50000,

          /*
           * IMPORTANT
           *
           * Only ONE item available.
           */
          stock: 1,

          version: 0,
        },
      });

    productId = product.id;
  });

  afterAll(async () => {

    await prisma.payment.deleteMany({
      where: {
        order: {
          userId: {
            in: [
              userAId,
              userBId,
            ],
          },
        },
      },
    });

    await prisma.orderItem.deleteMany({
      where: {
        order: {
          userId: {
            in: [
              userAId,
              userBId,
            ],
          },
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        userId: {
          in: [
            userAId,
            userBId,
          ],
        },
      },
    });

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [
            userAId,
            userBId,
          ],
        },
      },
    });

    await prisma.$disconnect();
  });

  it("should allow only one order when stock is 1", async () => {

    /*
     * Both users order at exactly
     * the same time.
     */

    const results =
      await Promise.allSettled([
        createOrder({
          userId: userAId,

          items: [
            {
              productId,
              quantity: 1,
            },
          ],
        }),

        createOrder({
          userId: userBId,

          items: [
            {
              productId,
              quantity: 1,
            },
          ],
        }),
      ]);

    /*
     * Count successful orders
     */
    const successfulOrders =
      results.filter(
        result =>
          result.status ===
          "fulfilled"
      );

    /*
     * Count failed orders
     */
    const failedOrders =
      results.filter(
        result =>
          result.status ===
          "rejected"
      );

    /*
     * Exactly one should succeed.
     */
    expect(
      successfulOrders
    ).toHaveLength(1);

    /*
     * Exactly one should fail.
     */
    expect(
      failedOrders
    ).toHaveLength(1);

    /*
     * Final stock must be zero.
     */
    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    expect(product?.stock).toBe(0);

    /*
     * Version should increment exactly once.
     */
    expect(product?.version).toBe(1);

    /*
     * Database should contain
     * exactly one confirmed order.
     */
    const orders =
      await prisma.order.findMany({
        where: {
          userId: {
            in: [
              userAId,
              userBId,
            ],
          },
        },
      });

    expect(orders).toHaveLength(1);

    expect(
      orders[0].status
    ).toBe("CONFIRMED");
  });
});