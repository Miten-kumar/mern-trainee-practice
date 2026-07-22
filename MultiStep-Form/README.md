# Multi-Step Form Application

A full-stack multi-step form application built using React, TypeScript, Node.js, Express.js, Prisma ORM, and PostgreSQL.

This project implements a complex multi-step form with dynamic fields, conditional validation, file uploads, progress persistence, error handling, accessibility, and complete frontend-backend API connectivity.

---

## Features

### Frontend Features

- React with TypeScript
- Multi-step form implementation
- React Hook Form for form management
- Zod schema validation
- Dynamic form fields
- Conditional field rendering and validation
- Resume and profile image upload
- Form data persistence using LocalStorage
- Context API state management
- Axios API integration
- Client-side error handling
- Form progress tracking
- Responsive user interface
- Accessibility-friendly form controls


### Backend Features

- Node.js with Express.js
- TypeScript backend
- PostgreSQL database integration
- Prisma ORM
- REST API architecture
- File upload handling using Multer
- Database storage
- API error handling
- Request validation
- Service-controller architecture


---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- React Hook Form
- Zod
- Axios
- React Hot Toast


### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Multer


---

# Installation and Setup

## Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file inside backend folder:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/multistep_form"

PORT=5000
```

Generate Prisma client:

```bash
npx prisma generate
```

Create database migration:

```bash
npx prisma migrate dev --name init
```

Start backend server:

```bash
npm run dev
```

Backend will start on:

```
http://localhost:5000
```


---

## Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend will start on:

```
http://localhost:5173
```


---

# Database Setup

Make sure PostgreSQL is installed and running.

Create database:

```sql
CREATE DATABASE multistep_form;
```

Run Prisma migration:

```bash
npx prisma migrate dev
```

Open Prisma database viewer:

```bash
npx prisma studio
```


---

# API Documentation

## Application APIs


### Create Application

Method:

```
POST
```

Endpoint:

```
/api/forms
```

Description:

Creates a new form submission with user details and uploaded files.


---

### Get All Applications

Method:

```
GET
```

Endpoint:

```
/api/forms
```

Description:

Returns all submitted applications.


---

### Get Application By ID

Method:

```
GET
```

Endpoint:

```
/api/forms/:id
```

Description:

Returns a single application by ID.


---

### Update Application

Method:

```
PUT
```

Endpoint:

```
/api/forms/:id
```

Description:

Updates existing application details.


---

### Delete Application

Method:

```
DELETE
```

Endpoint:

```
/api/forms/:id
```

Description:

Deletes an application.


---

# Upload APIs


## Upload Resume

Method:

```
POST
```

Endpoint:

```
/api/upload/resume
```


## Upload Profile Image

Method:

```
POST
```

Endpoint:

```
/api/upload/profile-image
```


---

# Form Validation

The form contains the following validations:

- Required field validation
- Email format validation
- Phone number validation
- Age validation
- Conditional validation based on employment type
- Dynamic skills validation
- File type validation
- File upload validation


---

# File Upload Support

Supported files:

- Resume PDF files
- Profile images (JPG, PNG)


Uploaded files are stored inside:

```
backend/uploads
```


---

# Application Working Flow

1. User enters personal information.
2. User moves to professional details.
3. Dynamic fields are displayed according to selected options.
4. User uploads required documents.
5. User reviews entered information.
6. User submits the form.
7. Backend validates request data.
8. Uploaded files are stored.
9. Data is saved into PostgreSQL database.
10. User receives successful submission response.


---

# Error Handling

Frontend handles:

- Validation errors
- API request errors
- Upload errors
- Submission failures


Backend handles:

- Invalid requests
- Database errors
- File upload errors
- Server errors


---

# Run Application

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open browser:

```
http://localhost:5173
```


---

# Future Improvements

- User authentication
- Admin dashboard
- Application management panel
- Email notifications
- Cloud storage integration
- Automated testing
- Deployment configuration


---
