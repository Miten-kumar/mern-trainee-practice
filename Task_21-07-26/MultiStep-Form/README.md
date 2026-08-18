# Multi-Step Registration Form with Validation

##  Project Overview

This project implements a full-stack **Multi-Step Registration Form** with advanced form handling, validation, file uploads, progress persistence, and backend database integration.

The application is built using:

- React + TypeScript (Frontend)
- React Hook Form
- Zod Validation
- Axios
- Node.js + Express + TypeScript (Backend)
- Prisma ORM
- PostgreSQL Database

---

#  Features

## Frontend Features

###  Multi-Step Form

The registration process is divided into multiple steps:

1. Personal Information
2. Employment Details
3. Skills
4. Document Upload
5. Review & Submit

### React Hook Form Integration

Used React Hook Form for:

- Optimized rendering
- Form state management
- Validation handling
- Dynamic fields

### Zod Schema Validation

Implemented schema-based validation using Zod.

Features:

- Required field validation
- Email validation
- Age validation
- Conditional validation
- Type inference with TypeScript

## Dynamic Field Arrays

Implemented dynamic skills using:

```
useFieldArray()
```
Users can:

- Add skills
- Remove skills
- Validate skill fields dynamically

## Conditional Validation

Employment fields are displayed based on user selection.

## File Upload

Implemented file upload support:

Supported files:

```
Resume (.pdf)

Profile Image (.png, .jpg)
```
---

## Progress Persistence

Form progress is automatically saved in:

```
localStorage
```

Benefits:

- Refresh page without losing data
- Continue unfinished registration
- Better user experience

---

# Backend Architecture

```
Request

   ↓

Routes

   ↓
Controller

   ↓

Service Layer

   ↓

Prisma ORM

   ↓

PostgreSQL Database
```
---

## Start Backend
npm run dev
http://localhost:3001

## Start Frontend
npm run dev
http://localhost:5173

---

# Error Handling

Implemented:

- API error handling
- Form validation messages
- Upload error handling
- Backend global error middleware

---