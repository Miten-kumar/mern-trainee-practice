import { body, ValidationChain } from "express-validator";

export const createUserValidation: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 }),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),
];