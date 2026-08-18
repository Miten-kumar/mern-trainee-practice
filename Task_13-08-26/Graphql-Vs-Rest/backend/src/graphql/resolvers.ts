import { userService } from "../services/user.service.js";
import { authService } from "../services/auth.service.js";

import type { GraphQLContext } from "./context.js";

export const resolvers = {
  Query: {
    users: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error(
          "Authentication required"
        );
      }

      return userService.getUsers();
    },

    user: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error(
          "Authentication required"
        );
      }

      return userService.getUserById(
        Number(args.id)
      );
    },
  },

  Mutation: {
    login: async (
      _: unknown,
      args: {
        email: string;
        password: string;
      }
    ) => {
      return authService.login(
        args.email,
        args.password
      );
    },
  },

  User: {
    posts: async (
      user: { id: number },
      _: unknown,
      context: GraphQLContext
    ) => {
      return context.loaders.postsByUserLoader.load(
        user.id
      );
    },
  },
};