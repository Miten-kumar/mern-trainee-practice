import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

import {
  validateBody,
} from "../middleware/validation.middleware.js";

import {
  authRateLimiter,
} from "../middleware/rateLimit.middleware.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  csrfToken,
  csrfProtection,
} from "../middleware/csrf.middleware.js";

const router = Router();

/**
 * GET /api/v1/auth/csrf-token
 */
router.get(
  "/csrf-token",
  csrfToken,
  (_req, res) => {
    res.status(200).json({
      success: true,
      csrfToken: res.locals.csrfToken,
    });
  }
);

/**
 * POST /api/v1/auth/register
 */
router.post(
  "/register",
  csrfProtection,
  authRateLimiter,
  validateBody(registerSchema),
  authController.register
);

/**
 * POST /api/v1/auth/login
 */
router.post(
  "/login",
  csrfProtection,
  authRateLimiter,
  validateBody(loginSchema),
  authController.login
);

/**
 * POST /api/v1/auth/logout
 */
router.post(
  "/logout",
  csrfProtection,
  authController.logout
);

/**
 * GET /api/v1/auth/me
 */
router.get(
  "/me",
  authMiddleware,
  authController.me
);

export default router;