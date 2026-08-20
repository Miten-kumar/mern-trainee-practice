import {
  Request,
  Response,
} from "express";

import {
  UserService,
} from "../services/UserService";

import {
  AuthGuard,
  RoleGuard,
} from "../decorators/guards";

import {
  CreateUserDto,
  UpdateUserDto,
} from "../dto/UserDto";

export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  async createUser(
    req: Request,
    res: Response
  ): Promise<void> {
    const dto =
      req.body as CreateUserDto;

    const user =
      await this.userService.createUser(
        dto
      );

    res.status(201).json({
      success: true,
      message:
        "User created successfully",
      data: user,
    });
  }

  async getUsers(
    _req: Request,
    res: Response
  ): Promise<void> {
    const users =
      await this.userService.getUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  }

  async getUserById(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = this.getParamId(req);

    const user =
      await this.userService.getUserById(
        id
      );

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
  }

  async updateUser(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = this.getParamId(req);

    const dto =
      req.body as UpdateUserDto;

    const user =
      await this.userService.updateUser(
        id,
        dto
      );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message:
        "User updated successfully",
      data: user,
    });
  }

  @AuthGuard()
  @RoleGuard("admin")
  async deleteUser(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = this.getParamId(req);

    const deleted =
      await this.userService.deleteUser(
        id
      );

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  }

  private getParamId(
    req: Request
  ): string {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new Error(
        "Invalid user ID"
      );
    }

    return id;
  }
}