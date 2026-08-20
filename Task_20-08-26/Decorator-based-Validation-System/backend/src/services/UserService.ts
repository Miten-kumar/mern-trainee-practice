import {
  CreateUserDto,
  UpdateUserDto,
} from "../dto/UserDto";

import type {
  User,
} from "../types/user";

export class UserService {
  private readonly users: User[] = [];

  async createUser(
    dto: CreateUserDto
  ): Promise<User> {
    const existingUser =
      this.users.find(
        (user) =>
          user.email.toLowerCase() ===
          dto.email.toLowerCase()
      );

    if (existingUser) {
      const error =
        new Error(
          "Email is already registered"
        ) as Error & {
          statusCode?: number;
        };

      error.statusCode = 409;

      throw error;
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      age: dto.age,
    };

    this.users.push(user);

    return user;
  }

  async getUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUserById(
    id: string
  ): Promise<User | null> {
    return (
      this.users.find(
        (user) => user.id === id
      ) ?? null
    );
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto
  ): Promise<User | null> {
    const index =
      this.users.findIndex(
        (user) => user.id === id
      );

    if (index === -1) {
      return null;
    }

    const current =
      this.users[index];

    const updated: User = {
      ...current,
      ...(dto.name !== undefined && {
        name: dto.name,
      }),
      ...(dto.email !== undefined && {
        email: dto.email,
      }),
      ...(dto.age !== undefined && {
        age: dto.age,
      }),
    };

    this.users[index] = updated;

    return updated;
  }

  async deleteUser(
    id: string
  ): Promise<boolean> {
    const index =
      this.users.findIndex(
        (user) => user.id === id
      );

    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);

    return true;
  }
}