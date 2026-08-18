import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.number().int().positive(),

  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "At least one product is required"),
});

export type CreateOrderInput = z.infer<
  typeof createOrderSchema
>;