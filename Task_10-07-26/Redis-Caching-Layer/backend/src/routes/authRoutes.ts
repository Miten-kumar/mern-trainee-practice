import { Router } from "express";

import {
  login,
  logout,
} from "../controllers/authController";

import {
  authMiddleware,
} from "../middleware/auth";

const router = Router();

// Login
router.post(
  "/login",
  login
);

// Logout
router.post(
  "/logout",
  logout
);

export default router;