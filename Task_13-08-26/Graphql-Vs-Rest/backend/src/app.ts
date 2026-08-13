import express from "express";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";

import { createGraphQLServer } from "./config/graphql.js";
import { createContext } from "./graphql/context.js";

import restRoutes from "./rest/user.routes.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "GraphQL vs REST backend is running",
  });
});

/**
 * REST API
 *
 * /api/v1/users
 * /api/v1/users/:id
 */
app.use("/api/v1/users", restRoutes);

/**
 * GraphQL
 */
const graphqlServer = createGraphQLServer();

await graphqlServer.start();

app.use(
  "/graphql",
  expressMiddleware(graphqlServer, {
    context: async ({ req }) => {
      return createContext({ req });
    },
  })
);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;