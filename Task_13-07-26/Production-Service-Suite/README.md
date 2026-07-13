# Production Security Suite
A comprehensive API security implementation using **Node.js, Express, TypeScript, Redis, and Jest**.

This project demonstrates production-level API security practices including:
- Redis-based flexible rate limiting
- Helmet security headers
- CSRF protection
- XSS input sanitization
- SQL Injection detection
- Security middleware testing
- Logging system

## Features

### 1. Rate Limiting with Redis

Implemented Redis-backed API rate limiting using:

- express-rate-limit
- rate-limit-redis
- Redis client

Benefits:

- Prevents brute-force attacks
- Supports distributed systems
- Stores limits centrally using Redis
---

# 2. Security Headers (Helmet)

Implemented Helmet middleware for HTTP security headers.

Protected against:

- Clickjacking
- MIME sniffing
- XSS attacks
- Information leakage
---

# 3. XSS Protection

Implemented input sanitization middleware.

Features:

- Removes malicious HTML
- Blocks script injection
- Sanitizes request body and params
---

# 4. SQL Injection protection
Implemented SQL injection detection middleware.

Detects patterns like:

' OR 1=1 --
UNION SELECT
DROP TABLE
DELETE FROM
---

# 5. Logging system
Implemented application logging using Winston.

Logs include:

Server startup
Redis connection
Security warnings
Errors

Create .env file:

PORT=5000

NODE_ENV=development

REDIS_URL=redis://localhost:6379


RATE_LIMIT_WINDOW=60

RATE_LIMIT_MAX=100

## REdis startup 
sudo apt install redis-server
sudo systemctl start redis
redis-cli ping
PONG

## Running Application 
npm run dev
npm run build
npm start

## API Testing 

## 1. Health Check

Request:

GET http://localhost:5000

## 2. GET User

Request:

GET http://localhost:5000/api/users

EX :- curl http://localhost:5000/api/users

## 3. Create User

Request:

POST http://localhost:5000/api/users


## Security Testing
# 1. Helmet Handler Test

Command:

curl -I http://localhost:5000

# 2. SQL injection Test

Command:

curl -X POST http://localhost:5000/api/users \
-H "Content-Type: application/json" \
-d "{\"email\":\"' OR 1=1 --\",\"password\":\"12345678\"}"

# 3. XSS Test

Command:

curl -X POST http://localhost:5000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"<script>alert(1)</script>"}'

# 4. Rate Limiter Test

Run:

for i in {1..120}; do curl http://localhost:5000/api/users; done

# 5. Testing 

Run:

npm test
