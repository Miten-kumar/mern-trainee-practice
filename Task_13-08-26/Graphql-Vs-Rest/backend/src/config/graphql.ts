import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../graphql/schema.js";
import { resolvers } from "../graphql/resolvers.js";

export const createGraphQLServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,

    introspection: true,
  });
};