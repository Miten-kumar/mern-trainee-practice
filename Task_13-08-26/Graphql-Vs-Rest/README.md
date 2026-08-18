## GraphQL Vs REST Analysis

A full-stack TypeScript project that converts a traditional REST API into a GraphQL API and compares both approaches in terms of architecture, data fetching, performance, caching, authentication, and scalability.

---

## Project Overview

This project demonstrates how the same backend business logic and database can be exposed through both:

- REST API
- GraphQL API

The application provides a React frontend where users can compare data fetched through REST and GraphQL.

The project also demonstrates:

- GraphQL schema design
- GraphQL resolvers
- Authentication
- DataLoader for solving the N+1 query problem
- REST and GraphQL error handling
- API performance comparison
- Over-fetching and under-fetching
- API trade-offs
- When to choose REST vs GraphQL

---

## How To Run
backend - npm run dev
http://localhost:5000

frontend - npm run dev
http://localhost:5173

## REST Api Endpoints 
GET /api/v1/users
GET /api/v1/users/:id

GET http://localhost:5000/api/v1/users

## GraphQL APi Endpoints
POST /graphql

--- 

## Architecture

PostgreSQL
                         │
                       Prisma
                         │
                   User Service
                    /         \
                   /           \
          REST Controller    GraphQL Resolver
                 │                  │
                 ↓                  ↓
          REST API             GraphQL API
                 │                  │
                 └────────┬─────────┘
                          │
                       Frontend

## GraphQL Schema

type User {
  id: ID!
  name: String!
  email: String!
  createdAt: String!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

## Graphql Resolver
Resolvers connect GraphQL fields with application business logic.

## N+1 Query problem 
The N+1 problem can happen when GraphQL resolves related data individually.

## Data Loader Solution
DataLoader batches multiple requests into a single database query.


