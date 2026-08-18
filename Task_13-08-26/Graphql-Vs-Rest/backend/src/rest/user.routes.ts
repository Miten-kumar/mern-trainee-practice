import { Router } from "express";

import {
  userController,
} from "./user.controller.js";

const router = Router();

router.get(
  "/",
  userController.getUsers.bind(userController)
);

router.get(
  "/:id",
  userController.getUserById.bind(userController)
);

export default router;