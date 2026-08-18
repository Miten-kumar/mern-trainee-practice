import { z } from "zod";

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  email: z
    .email()
    .optional(),
});