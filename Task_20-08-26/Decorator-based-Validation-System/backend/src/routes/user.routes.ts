import {
  Router,
} from "express";

import {
  UserController,
} from "../controllers/UserController";

import {
  UserService,
} from "../services/UserService";

import {
  CreateUserDto,
  UpdateUserDto,
} from "../dto/UserDto";

import {
  validateBody,
} from "../middleware/validationMiddleware";

import {
  mockAuth,
} from "../middleware/authMiddleware";

import {
  executeGuards,
} from "../middleware/guardMiddleware";

const router = Router();

const userService =
  new UserService();

const userController =
  new UserController(
    userService
  );

/**
 * Create user
 */
router.post(
  "/",
  validateBody(CreateUserDto),
  (
    req,
    res,
    next
  ) => {
    void userController
      .createUser(req, res)
      .catch(next);
  }
);

/**
 * Get all users
 */
router.get(
  "/",
  (
    req,
    res,
    next
  ) => {
    void userController
      .getUsers(req, res)
      .catch(next);
  }
);

/**
 * Get user
 */
router.get(
  "/:id",
  (
    req,
    res,
    next
  ) => {
    void userController
      .getUserById(req, res)
      .catch(next);
  }
);

/**
 * Update user
 */
router.put(
  "/:id",
  validateBody(UpdateUserDto),
  (
    req,
    res,
    next
  ) => {
    void userController
      .updateUser(req, res)
      .catch(next);
  }
);

/**
 * Delete user
 *
 * mockAuth:
 *   Authentication
 *
 * executeGuards:
 *   @AuthGuard()
 *   @RoleGuard("admin")
 */
router.delete(
  "/:id",

  mockAuth,

  executeGuards(
    userController,
    "deleteUser"
  ),

  (
    req,
    res,
    next
  ) => {
    void userController
      .deleteUser(req, res)
      .catch(next);
  }
);

export default router;