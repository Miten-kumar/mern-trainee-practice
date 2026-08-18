import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { UserService } from "../services/user.service.js";

const userService = new UserService();

const getUserId = (req: Request): string => {
  const { id } = req.params;

  if (typeof id !== "string" || id.trim() === "") {
    throw new Error("Invalid user ID");
  }

  return id;
};

export class UserController {
  async getUsers(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.getUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = getUserId(req);

      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = getUserId(req);

      const updatedUser =
        await userService.updateUser(
          id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = getUserId(req);

      await userService.deleteUser(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const userController =
  new UserController();