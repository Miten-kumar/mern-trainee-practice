import { prisma } from "../config/database.js";

class UserService {
  /**
   * Get all users
   */
  async getUsers() {
    return prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}

export const userService =
  new UserService();