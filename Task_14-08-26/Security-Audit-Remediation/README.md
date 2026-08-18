# Security Audit & Remediation

The project implements security best practices on both the frontend and backend, including authentication, authorization, CSRF protection, XSS prevention, SQL injection prevention, security headers, rate limiting, input validation, dependency scanning, and security testing.

---

## 1. Project Overview

The goal of this project is to perform a security audit of a web application and remediate common security vulnerabilities.

### Main Objectives

- Identify security vulnerabilities
- Implement security best practices
- Protect authentication and sessions
- Prevent SQL Injection
- Prevent Cross-Site Scripting (XSS)
- Protect against CSRF attacks
- Configure security headers
- Implement rate limiting
- Validate and sanitize user input
- Secure sensitive data
- Scan dependencies for vulnerabilities
- Write automated security tests

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- Helmet
- CORS
- Cookie Parser
- Express Rate Limit
- CSRF-CSRF
- Winston

## Testing

- Vitest
- Supertest

## Security Tools

- npm audit
- Helmet
- express-rate-limit- 
- csrf-csrf
- Prisma parameterized queries
- Input validation and sanitization

---

## How To Run
backend - npm run dev
http://localhost:5000

frontend - npm run dev
http://localhost:5173

---

## Security Control Implemented
1. Authentication
2. Authorization
3. csrf protection
4. SQL Injection Protection
5. XSS Protection
6. Input Validation
7. input senitization
8. Security Headers
9. Content-security policy
10. CORS Protection
11. Rate limiting
12. Request body limit
13. secure cookies
14. Error handling
15. 404 handling
16. Dependency vulnerability scanning
17. Security Testing
---

## API Routes
Authentication
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
GET  /api/v1/auth/csrf-token

Users
GET /api/v1/users
GET /api/v1/users/:id

Health Check
GET /health

## Running Tests
npm test
npx vitest run
npx vitest run tests/security/csrf.test.ts
npx vitest run tests/security/sqlInjection.test.ts
npx vitest run tests/security/xss.test.ts
npx vitest run tests/security/xss.test.ts
npx vitest run tests/security/headers.test.ts

## Running npm Audit
npm audit
npm audit fix
npm audit --omit=dev

---