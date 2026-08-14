import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../config/database.js";
import { env } from "../config/env.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      12
    );

    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(input: LoginInput) {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN,
      } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

export const authService = new AuthService();