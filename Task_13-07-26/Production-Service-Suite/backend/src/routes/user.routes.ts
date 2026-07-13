import { Router } from "express";

import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
} from "../controller/userController";

import { sqlInjectionGuard } from "../middleware/sqlInjection";
import { sanitizeInput } from "../middleware/sanitizer";


const router = Router();


// Security middleware FIRST
router.use(sqlInjectionGuard);
router.use(sanitizeInput);


// Routes
router.get(
  "/",
  getUsers
);


router.get(
  "/:id",
  getUserById
);


router.post(
  "/",
  createUser
);


router.put(
  "/:id",
  updateUser
);


router.delete(
  "/:id",
  deleteUser
);


export default router;