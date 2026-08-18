import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../config/database.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "development-secret";

class AuthService {
  async login(
    email: string,
    password: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      throw new Error(
        "Invalid email or password"
      );
    }

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid) {
      throw new Error(
        "Invalid email or password"
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return {
      token,
      user,
    };
  }

  verifyToken(token: string) {
    return jwt.verify(
      token,
      JWT_SECRET
    ) as {
      userId: number;
      email: string;
    };
  }
}

export const authService =
  new AuthService();