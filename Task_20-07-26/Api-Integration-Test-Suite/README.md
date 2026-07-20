# API Integration Test Suite

A full-stack application for testing and validating API integrations with frontend, backend, authentication, database operations, and automated testing.

This project implements User Management CRUD operations with JWT authentication and verifies API behavior through happy paths, error cases, edge cases, database state validation, and transaction handling.

---

# Project Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Protected API Routes
- Token Based Authorization


## User Management

The application supports:

- Create User
- Get All Users
- Get User By ID
- Update User
- Delete User


## Validation

Implemented validations:

- Required fields validation
- Duplicate email validation
- Invalid ID validation
- User not found handling
- Server error handling


## Testing Coverage

The project covers:

- Happy path testing
- Error case testing
- Edge case testing
- Database state testing
- Transaction testing
- Authentication testing


---

# Tech Stack


## Frontend

- React.js
- TypeScript
- Vite
- Axios
- React Router


## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT


## Testing

- Jest
- Supertest


---

# Project Architecture


```
Frontend (React + TypeScript)

          |
          |
          ↓

Axios API Client

          |
          |
          ↓

Express REST API

          |
          |
          ↓

Controllers

          |
          |
          ↓

Prisma ORM

          |
          |
          ↓

PostgreSQL Database
```

---

# Folder Structure


```
API-Integration-Test-Suite

│
├── frontend
│
│   ├── src
│   │
│   ├── api
│   ├── components
│   ├── pages
│   ├── services
│   └── types
│
│
├── backend
│
│   ├── src
│   │
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── config
│   └── tests
│
│
├── prisma
│
│   ├── schema.prisma
│   └── seed.ts
│
│
└── README.md
```

---

# Backend Setup


Go to backend folder:


```bash
cd backend
```


Install dependencies:


```bash
npm install
```


---

# Environment Variables


Create `.env` file inside backend folder:


```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

JWT_SECRET="your_secret_key"

PORT=5000
```


---

# Prisma Setup


Generate Prisma Client:


```bash
npx prisma generate
```


Run migrations:


```bash
npx prisma migrate dev
```


Seed database:


```bash
npx prisma db seed
```


Open Prisma Studio:


```bash
npx prisma studio
```


---

# Run Backend


Start backend server:


```bash
npm run dev
```


Backend runs on:


```
http://localhost:5000
```


---

# Frontend Setup


Go to frontend folder:


```bash
cd frontend
```


Install dependencies:


```bash
npm install
```


Run frontend:


```bash
npm run dev
```


Frontend runs on:


```
http://localhost:5173
```


---

# Database Schema


User Model:


```prisma
model User {

 id Int @id @default(autoincrement())

 name String

 email String @unique

 password String

 createdAt DateTime @default(now())

 updatedAt DateTime @updatedAt

}
```


---

# API Documentation


# Authentication APIs


## Register User


### Endpoint

```
POST /api/auth/register
```


Request:


```json
{
"name":"John",
"email":"john@test.com",
"password":"123456"
}
```


Response:


```json
{
"message":"User registered successfully"
}
```


---

## Login User


### Endpoint


```
POST /api/auth/login
```


Request:


```json
{
"email":"john@test.com",
"password":"123456"
}
```


Response:


```json
{
"token":"jwt_token"
}
```


---

# User APIs


## Create User


Endpoint:


```
POST /api/users
```


Headers:


```
Authorization: Bearer token
```


Request:


```json
{
"name":"John",
"email":"john@test.com"
}
```


Expected Response:


```json
{
"id":1,
"name":"John",
"email":"john@test.com"
}
```


---

## Get All Users


Endpoint:


```
GET /api/users
```


Response:


```json
[
{
"id":1,
"name":"John",
"email":"john@test.com"
}
]
```


---

## Get User By ID


Endpoint:


```
GET /api/users/:id
```


Example:


```
GET /api/users/1
```


---

## Update User


Endpoint:


```
PUT /api/users/:id
```


Request:


```json
{
"name":"Updated John",
"email":"updated@test.com"
}
```


---

## Delete User


Endpoint:


```
DELETE /api/users/:id
```


Response:


```json
{
"message":"User deleted successfully"
}
```


---

# Backend Testing


## Authentication Testing


### Register API Tests


Test cases:


- Register user with valid details
- Register without name
- Register without email
- Register without password
- Register duplicate email


Expected:


```
Valid request → 201 Created

Invalid request → 400 Bad Request
```


---

## Login API Tests


Test cases:


- Login with correct credentials
- Login with wrong password
- Login with invalid email
- Login without required fields


Expected:


```
Success → JWT Token

Failure → 401 Unauthorized
```


---

# User CRUD API Testing


## Create User Testing


### Test Case 1

Create user with valid data.


Input:


```json
{
"name":"Alex",
"email":"alex@test.com"
}
```


Expected:


```
201 Created
```


---

### Test Case 2

Create user without name.


Expected:


```
400 Bad Request
```


---

### Test Case 3

Create user without email.


Expected:


```
400 Bad Request
```


---

### Test Case 4

Create duplicate email.


Expected:


```
400 Bad Request
```


Response:


```json
{
"message":"Email already exists"
}
```


---

# Get Users Testing


Test cases:


- Get all users
- Get existing user by ID
- Get invalid user ID
- Get deleted user


Expected:


```
200 OK

400 Bad Request

404 Not Found
```


---

# Update User Testing


Test cases:


- Update existing user
- Update invalid user ID
- Update duplicate email


Expected:


```
200 OK

400 Bad Request

404 Not Found
```


---

# Delete User Testing


Test cases:


- Delete existing user
- Delete non-existing user


Expected:


```
200 OK

404 Not Found
```


---

# Authentication Middleware Testing


## Without Token


Request:


```
POST /api/users
```


Expected:


```
401 Unauthorized
```


---

## Invalid Token


Expected:


```
401 Unauthorized
```


---

## Valid Token


Expected:


```
API request successful
```


---

# Database Testing


Verified:


## Create Operation

- User inserted successfully
- Database state updated correctly


## Update Operation

- User details updated correctly


## Delete Operation

- User removed successfully


## Unique Constraint

- Duplicate email rejected


## Transaction Testing

- Failed operations rollback correctly
- No incomplete data stored


---

# Automated Integration Testing


Testing Tools:


```
Jest
Supertest
```


Test Cases:


```
✓ Register user

✓ Login user

✓ Authentication middleware

✓ Create user

✓ Validate required fields

✓ Prevent duplicate email

✓ Get all users

✓ Get user by ID

✓ Update user

✓ Delete user

✓ Database state validation

✓ Transaction rollback testing
```


---

# Running Tests


Run all tests:


```bash
npm test
```


Run tests with coverage:


```bash
npm test -- --coverage
```


---

# Error Handling


Handled errors:


- Invalid request
- Missing fields
- Unauthorized access
- Duplicate records
- Database errors
- Server errors


---

# Future Improvements


- Role based authorization
- Refresh token support
- Pagination
- Search and filtering
- Docker deployment
- CI/CD pipeline


---

# Conclusion


This project demonstrates complete API integration testing with React frontend, Express backend, PostgreSQL database, Prisma ORM, and automated testing.

It ensures APIs are reliable, secure, and handle both successful and failure scenarios correctly.