# Comprehensive Error Handling System

A full-stack error handling system built with **React + TypeScript (Frontend)** and **Express + TypeScript + PostgreSQL (Backend)**.

This project demonstrates production-level error handling practices including:

- React Error Boundaries
- Global error handling
- API error handling
- Network error detection
- Retry mechanisms
- Error logging
- Fallback UI patterns
- Error analytics dashboard
- PostgreSQL based error storage

##  Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Custom React Hooks
- CSS3

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- REST API

### Database

- PostgreSQL
- Prisma Client
---

#  Features

## Frontend Error Handling

### 1. React Error Boundaries

Multiple levels of error boundaries are implemented:

### Application Level

Handles complete application crashes.

### Page Level

Handles individual page failures.

### Component Level

Handles widget/component specific failures.

---

## 2. Fallback UI

When runtime errors occur, users see a friendly UI instead of application crash.

---

## 3. Network Error Handling

Detects:

- Internet disconnection
- API unavailable
- Server timeout

---

## 4. Retry Mechanism

Implemented using custom hook:

useRetry()
Handles:

- Failed API requests
- Retry attempts
- Loading states
- Error states

---

# Backend Error Handling

## Global Error Middleware
Handles:

- Runtime errors
- API errors
- Database errors

## Error Logging System

Errors are captured and stored.

Stored information:

Error message
Error type
Stack trace
API endpoint
Timestamp

## Database setup
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio

## Application flow 

User

 ↓

React Component

 ↓

Axios API Client

 ↓

Express API

 ↓

Controller

 ↓

Service Layer

 ↓

Prisma ORM

 ↓

PostgreSQL Database

## Error Handling Flow 

Error Occurs

      ↓

Detect Error

      ↓

Classify Error

      ↓

Log Error

      ↓

Show Fallback UI

      ↓

Allow Recovery

## Learning Objective complete

 Prevent application crashes
 Implement React Error Boundaries
 Handle API failures gracefully
 Implement retry strategies
 Create fallback UI patterns
 Store errors in database
 Build scalable error handling architecture



