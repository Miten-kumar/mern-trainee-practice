import { env } from "./env";

export const securityConfig = {
  // Helmet
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests:
          env.NODE_ENV === "production" ? [] : null,
      },
    },

    frameguard: {
      action: "deny" as const,
    },

    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    referrerPolicy: {
      policy: "no-referrer" as const,
    },
  },

  // CORS
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },

  // Express JSON payload size
  jsonLimit: "10kb",

  // Rate Limiting
  rateLimit: {
    windowSeconds: env.RATE_LIMIT_WINDOW,
    maxRequests: env.RATE_LIMIT_MAX,
    keyPrefix: "global",
  },

  // Cookie settings
  cookies: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
  },
};