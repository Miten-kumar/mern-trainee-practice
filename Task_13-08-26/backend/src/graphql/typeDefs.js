const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    bio: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    createdAt: String!
    author: User!
    comments: [Comment!]!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    text: String!
    createdAt: String!
    author: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createPost(title: String!, body: String!): Post!
    createComment(postId: ID!, text: String!): Comment!
  }
`;

module.exports = { typeDefs };
