import { Router } from "express";

import { userController } from "../controllers/user.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  validateBody,
} from "../middleware/validation.middleware.js";

import {
  updateUserSchema,
} from "../validators/user.validator.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  userController.getUsers
);

router.get(
  "/:id",
  userController.getUserById
);

router.patch(
  "/:id",
  validateBody(updateUserSchema),
  userController.updateUser
);

router.delete(
  "/:id",
  userController.deleteUser
);

export default router;