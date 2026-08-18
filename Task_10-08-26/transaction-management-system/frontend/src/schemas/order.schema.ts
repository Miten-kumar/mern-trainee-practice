import { z } from "zod";

export const orderSchema = z.object({
  userId: z
    .number({
      error: "User ID is required",
    })
    .int("User ID must be an integer")
    .positive("User ID must be greater than 0"),

  productId: z
    .number({
      error: "Product ID is required",
    })
    .int("Product ID must be an integer")
    .positive("Product ID must be greater than 0"),

  quantity: z
    .number({
      error: "Quantity is required",
    })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),
});

export type OrderFormData =
  z.infer<typeof orderSchema>;