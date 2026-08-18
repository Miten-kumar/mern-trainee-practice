import type { Request, Response } from "express";

import { userService } from "../services/user.service.js";

class UserController {
  // GET /api/v1/users
  async getUsers(
    _req: Request,
    res: Response
  ): Promise<void> {
    try {
      const users =
        await userService.getUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error(
        "REST getUsers error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }

  // GET /api/v1/users/:id
  async getUserById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });

        return;
      }

      const user =
        await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });

        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(
        "REST getUserById error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  }
}

export const userController =
  new UserController();