# Transaction Management System

A production-ready full-stack Transaction Management System built using **React, TypeScript, Node.js, Express, Prisma, and PostgreSQL**.

The main purpose of this project is to demonstrate how complex database transactions can be safely handled when multiple operations depend on each other.

---

## Task Requirements

This project implements:

- Order processing
- Inventory deduction
- Payment processing
- Database transactions
- Transaction rollback
- Concurrent order handling
- Optimistic locking
- Race-condition handling
- Transaction failure handling
- Backend API validation
- Frontend order flow
- PostgreSQL database persistence
- Automated transaction tests

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- React Hook Form
- Zod
- Tailwind CSS

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- Jest
- Supertest

## Database

- PostgreSQL

---

## API Endpoints

## Products 
basic url :- /api/v1

Get Products
GET /api/v1/products
Get Product
GET /api/v1/products/:id

## Orders 
Create Order
POST /api/v1/orders
Get Order
GET /api/v1/orders/:id

## Payments 
Get Payment
GET /api/v1/payments/:orderId

## Run Backend 
npm run dev
http://localhost:5000
API :- http://localhost:5000/api/v1

## Run Frontend
npm run dev
https://localhost:5173

## Application Flow 
The frontend application follows this flow:

Products Page
      │
      ▼
Select Product
      │
      ▼
Buy Now
      │
      ▼
Order Page
      │
      ▼
Enter Quantity
      │
      ▼
Place Order
      │
      ▼
POST /api/v1/orders
      │
      ▼
Backend Transaction
      │
      ├── Validate Order
      │
      ├── Check Stock
      │
      ├── Check Version
      │
      ├── Deduct Inventory
      │
      ├── Create Order
      │
      ├── Process Payment
      │
      └── Commit
      │
      ▼
Order Summary

## Failure Flow

If any operation fails:

Place Order
     │
     ▼
Begin Transaction
     │
     ├── Inventory ✓
     ├── Order ✓
     ├── Payment ✗
     │
     ▼
ROLLBACK
     │
     ▼
Transaction Failed

The frontend displays an error message.

ex :- Something went wrong
      Insufficient stock.
      [Try Again]

## Testing 
npm test 
npm run test:watch
npm run test:coverage



