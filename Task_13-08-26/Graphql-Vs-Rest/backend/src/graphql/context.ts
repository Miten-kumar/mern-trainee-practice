import type { Request } from "express";

import {
  getAuthenticatedUser,
} from "../middleware/auth.middleware.js";

import { createLoaders } from "./loaders.js";

export interface GraphQLContext {
  req: Request;

  user: {
    userId: number;
    email: string;
  } | null;

  loaders: ReturnType<typeof createLoaders>;
}

export const createContext = ({
  req,
}: {
  req: Request;
}): GraphQLContext => {
  return {
    req,

    user: getAuthenticatedUser(req),

    loaders: createLoaders(),
  };
};