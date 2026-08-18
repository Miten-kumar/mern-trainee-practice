## Database Performance Audit
A full-stack application focused on analyzing and improving database performance using PostgreSQL optimization techniques.

The project demonstrates slow query analysis, indexing strategies, N+1 query optimization, query result caching, and performance monitoring.

## Tech Stack 
Frontend
React.js
TypeScript
Vite
Axios
React Router
CSS

Backend
Node.js
Express.js
TypeScript
Prisma ORM
PostgreSQL
Redis
Winston Logger

Database
PostgreSQL
Index Optimization
EXPLAIN ANALYZE Query Analysis

## project objective 
The main goal of this project is to identify slow database queries and improve application performance.

The task includes:

Analyze slow SQL queries
Use EXPLAIN ANALYZE for query planning
Create optimized indexes
Fix N+1 query problems
Implement Redis query caching
Compare query performance before and after optimization

## Backend setup
Navigate to backend:

cd backend

Install dependencies:

npm install

## prisma setup
Generate Prisma client:

npx prisma generate

Run migrations:

npx prisma migrate dev

Seed database:

npx prisma db seed

## start backend setup
Development:

npm run dev

Backend runs:

http://localhost:5000

## frontend setup
Navigate:

cd frontend

Install dependencies:

npm install

## run frontend
npm run dev

Frontend runs:

http://localhost:5173

## Application flow
React Frontend | | Axios | | Express API | | Controllers | | Services | | Prisma ORM | | PostgreSQL Database | | Redis Cache 

## slow query analysis
Initially slow queries were identified using:

EXPLAIN ANALYZE

Example:

SELECT *
FROM "Order"
WHERE user_id = 10;

Before optimization:

Sequential Scan

Execution Time:
1500ms

## index optimization
Indexes were created to improve query lookup speed.

Example:

CREATE INDEX idx_orders_user_id
ON "Order"(user_id);

After optimization:

Index Scan

Execution Time:
20ms

## N+1 query optimization
Fetching users and orders separately:

Query Users

+

Query Orders for every user

Example:

1 Query Users

100 Queries Orders

Total:
101 Queries

## Query result caching 
Redis caching implemented for frequently accessed data.

Flow:

Request

 |
 |
Check Redis Cache

 |
 |
Cache Hit
Return Data

 |
 |
Cache Miss

 |
 |
Database Query

 |
 |
Store Result in Redis

## Performance Improvement 
Before Optimization:

Query Time:
2500ms

After Optimization:

Query Time:
50ms

Improvement:

50x Faster

## feature implemented 
PostgreSQL database integration
 Prisma ORM setup
 Slow query identification
 EXPLAIN ANALYZE analysis
 Index creation
 N+1 query optimization
 Redis caching
 REST API development
 React dashboard
 Performance monitoring UI
 Error handling
 Logging system

## Dashboard preview 
The frontend dashboard displays:

Database performance comparison
Before optimization timing
After optimization timing
Improvement percentage
Users and order information