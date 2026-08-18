import { prisma } from "../config/database.js";

interface UpdateUserInput {
  name?: string;
  email?: string;
}

export class UserService {
  async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateUser(
    id: string,
    input: UpdateUserInput
  ) {
    const data: UpdateUserInput = {};

    if (input.name !== undefined) {
      data.name = input.name.trim();
    }

    if (input.email !== undefined) {
      data.email = input.email.trim().toLowerCase();
    }

    if (data.email) {
      const existingUser =
        await prisma.user.findFirst({
          where: {
            email: data.email,
            NOT: {
              id,
            },
          },
        });

      if (existingUser) {
        throw new Error(
          "Email is already registered"
        );
      }
    }

    return prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

export const userService = new UserService();