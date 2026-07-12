# Redis Caching Layer with PostgreSQL, Prisma & TypeScript

## Overview

This project is a backend REST API built using **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, and **Redis**. It demonstrates how Redis can be used to improve application performance by caching frequently accessed data, managing user sessions, preventing cache stampede, and implementing rate limiting.

## Features

- Redis Product List Caching
- Cache Invalidation after Product Update
- Cache Stampede Prevention using Redis Locks
- Redis Session Management
- API Rate Limiting with Redis
- PostgreSQL Database using Prisma ORM
- TypeScript Support
- RESTful APIs

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- JWT
- Nodemon

---

# Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce"

REDIS_URL="redis://localhost:6379"

JWT_SECRET=your secret
```
Replace the PostgreSQL username and password with your own credentials.

---

# Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev --name init
```

(Optional) Open Prisma Studio

```bash
npx prisma studio
```

---

# Run Redis

Start Redis Server

```bash
redis-server
```

Verify Redis

```bash
redis-cli
```

Then run

```bash
PING
```

Output

```
PONG
```
---

# Run the Project

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Run Production

```bash
npm start
```
---

# API Endpoints

## Health Check

```
GET /
```

---

## Login

```
POST /api/auth/login
```

---

## Logout

```
POST /api/auth/logout
```

---

## Get Products

```
GET /api/products
```

Returns all products.

- First request → Fetches data from PostgreSQL and stores it in Redis.
- Next requests → Returns data directly from Redis.

---

## Update Product
```
PUT /api/products/:id
```

Example Body

```json
{
  "price": 60000
}
```

When a product is updated, the Redis cache is automatically invalidated so the next request fetches fresh data from PostgreSQL.

---

# Redis Workflow

## Product Caching

```
Client
   │
   ▼
Express API
   │
   ▼
Redis Cache
   │
Cache Hit?
   │
 ┌─Yes───────────────┐
 │                   │
 ▼                   │
Return Cached Data   │
                     │
        No           │
         ▼           │
   PostgreSQL        │
         ▼           │
 Store in Redis      │
         ▼           │
 Return Response ◄───┘
```

---

## Cache Invalidation

```
Update Product
      │
      ▼
Update PostgreSQL
      │
      ▼
Delete Redis Cache
      │
      ▼
Next Request Creates New Cache
```

---

## Cache Stampede Prevention

Redis locks ensure that if multiple users request the same uncached data simultaneously, only one request fetches data from PostgreSQL while the others wait for the cache to be created.

---

## Session Management

- User logs in.
- JWT token is generated.
- Session is stored in Redis.
- Protected APIs verify the Redis session before allowing access.

---

## Rate Limiting

Redis tracks requests from each IP address.

Example Configuration

- Time Window: 60 Seconds
- Maximum Requests: 100

If the limit is exceeded, the API returns:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

# Testing

Use Postman or Thunder Client.

### Get Products

```
GET http://localhost:5000/api/products
```

### Update Product

```
PUT http://localhost:5000/api/products/1
```

Body

```json
{
  "price": 60000
}
```

---


