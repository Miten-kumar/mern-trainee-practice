import { Request, Response, NextFunction } from "express";

interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * GET /users
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Replace with actual database/service call
    const users: User[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
      },
    ];

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /users/:id
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Replace with database lookup
    const user: User = {
      id: Number(id),
      name: "John Doe",
      email: "john@example.com",
    };

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /users
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email } = req.body;

    // Save user to database here

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: Date.now(),
        name,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /users/:id
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Update user in database

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: Number(id),
        name,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /users/:id
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Delete user from database

    res.status(200).json({
      success: true,
      message: `User ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};