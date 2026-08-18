import cors from "cors";
import helmet from "helmet";

import { env } from "./env.js";

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
    },
  },

  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
});

export const corsMiddleware = cors({
  origin: env.FRONTEND_URL,

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-CSRF-Token",
  ],
});