export const typeDefs = `#graphql
  type User {
  id: ID!
  name: String!
  email: String!
  createdAt: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  userId: Int!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  login(
    email: String!
    password: String!
  ): AuthPayload!
}
`;