# RESTful API Redesign

A versioned RESTful API implementation following industry best practices including proper HTTP methods, status codes, HATEOAS links, comprehensive error handling, API documentation, pagination, rate limiting, and frontend CRUD integration.

---

# Project Overview

This project demonstrates the redesign and implementation of a production-style RESTful API.

The application provides:

- Versioned API architecture
- RESTful resource management
- Proper HTTP methods
- Standard HTTP status codes
- HATEOAS support
- Centralized error handling
- OpenAPI documentation
- API rate limiting
- Pagination support
- React TypeScript frontend integration

---

# Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger / OpenAPI
- Express Rate Limit

## Frontend

- React.js
- TypeScript
- React Router
- TanStack React Query
- Axios
- CSS

---

## How To Run  

backend :- npm run dev
http://localhost:5000

frontend :- npm run dev
http://localhost:5173

---

## API Versioning 

All APIs are versioned.

Base URL:

/api/v1

Example:

GET /api/v1/users

Response header:

X-API-Version: v1

## API EndPoints 

Get All Users
GET /api/v1/users

Get User By ID
GET /api/v1/users/:id

Create User
POST /api/v1/users

Update User
PATCH /api/v1/users/:id

Delete User
DELETE /api/v1/users/:id

## HATEOAS Implementation 

API responses contain related actions:

{
"id":1,
"name":"Bhoomi",

"_links":[

{
 "rel":"self",
 "href":"/api/v1/users/1",
 "method":"GET"
},

{
 "rel":"update",
 "href":"/api/v1/users/1",
 "method":"PATCH"
},

{
 "rel":"delete",
 "href":"/api/v1/users/1",
 "method":"DELETE"
}

]
}

## Pagination 
Users API supports pagination:
GET /api/v1/users?page=1&limit=10

## Error handling 
All errors follow a common format:
{
 "success":false,

 "error":{

 "code":"USER_NOT_FOUND",

 "message":"User not found",

 "status":404,

 "path":"/api/v1/users/99"

 },

 "timestamp":"2026-07-30"
}

## Rate Limiting 
API requests are protected using rate limiting.

Configuration:

100 requests / 15 minutes

Exceeded response:

429 Too Many Requests

## OpenAPI Documentation 
Swagger documentation available at:

http://localhost:5000/api-docs

Includes:

API endpoints
Request schemas
Response schemas
Error responses
HTTP status codes

## Frontend Features 
Implemented:

User listing table
Create user form
Update user form
Delete user action
User details page
HATEOAS action display
Loading states
Error states
React Query caching
TypeScript type safety

---


