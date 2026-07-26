# Infinite Scroll Product List

A full-stack Infinite Scroll Product Listing application built with **React + TypeScript**, **Node.js + Express + TypeScript**, **Prisma ORM**, and **PostgreSQL**.

This project implements a production-style product listing system with cursor-based pagination, intersection observer based infinite scrolling, skeleton loading, error handling, accessibility support, and scroll position restoration.

---

#  Features

## Frontend Features

 Infinite Scroll Product Listing  
 Intersection Observer API  
 Cursor Based Pagination  
 React Query Infinite Query  
 Skeleton Loading UI  
 API Error Handling  
 Retry Mechanism  
 Scroll Position Restoration  
 Responsive Product Grid  
 Accessibility Support  
 TypeScript Implementation  


## Backend Features

 REST API using Express.js  
 TypeScript Backend  
 Prisma ORM Integration  
 PostgreSQL Database  
 Cursor Pagination Logic  
 Product API  
 Error Handling Middleware  
 Seed Data Generation  


---

#  Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React.js | UI Development |
| TypeScript | Type Safety |
| Vite | Frontend Build Tool |
| React Query | Server State Management |
| Axios | API Communication |
| CSS | Styling |


## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | API Framework |
| TypeScript | Type Safety |
| Prisma | ORM |
| PostgreSQL | Database |

---

#  Backend Setup

## 1. Install Dependencies

Go to backend folder:

```bash
cd backend
```

Install packages:

```bash
npm install
```

---

## 2. Environment Configuration

Create:

```
.env
```

Add:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/product_db"
PORT=5000
```

---

# Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migration:

```bash
npx prisma migrate dev --name init
```

---

# Seed Database

Insert sample products:

```bash
npx prisma db seed
```

The seed creates:

```
50 Products
Product Images
Product Description
Product Prices
```

---

# Start Backend Server

Development mode:

```bash
npm run dev
```

Server runs:

```
http://localhost:5000
```

---

# API Endpoints

## Get Products

### Request

```
GET /api/products
```

Query Parameters:

| Parameter | Description |
|-|-|
| limit | Number of products |
| cursor | Last product id |


Example:

```
GET /api/products?limit=10
```


Response:

```json
{
 "success":true,
 "data":{
   "products":[
      {
       "id":"123",
       "name":"Laptop",
       "price":50000,
       "image":"image-url"
      }
   ],
   "nextCursor":"123",
   "hasMore":true
 }
}
```

---

# Frontend Setup


Go to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```


---

# Environment Configuration


Create:

```
.env
```


Add:

```env
VITE_API_URL=http://localhost:5000/api
```


---

# Start Frontend


Run:

```bash
npm run dev
```


Application runs:

```
http://localhost:5173
```

---

# 🔄 Application Flow


```
User Opens Product Page

        |
        |
React Query Fetches Products

        |
        |
Axios API Request

        |
        |
Express Controller

        |
        |
Product Service

        |
        |
Prisma ORM

        |
        |
PostgreSQL Database

        |
        |
Return Products + Cursor

        |
        |
Display Products

        |
        |
User Scrolls

        |
        |
Intersection Observer Trigger

        |
        |
Fetch Next Cursor Data

```

---

# Pagination Implementation


Instead of traditional pagination:


```
?page=1
?page=2
?page=3
```


This project uses cursor pagination:


```
First Request:

GET /products?limit=10


Next Request:

GET /products?cursor=id&limit=10

```


Advantages:

- Better performance
- Avoids duplicate records
- Handles large datasets
- Scalable for production applications


---

# Infinite Scroll Implementation


Flow:

```
Product List

      ↓

Bottom Loader Element Visible

      ↓

Intersection Observer Detects

      ↓

fetchNextPage()

      ↓

API Request With Cursor

      ↓

New Products Added

```

---

# Loading State


While fetching products:

```
Skeleton Cards
```

are displayed instead of blank screen.


Benefits:

- Better user experience
- Improved perceived performance


---

# Error Handling


Handled cases:

## API Failure

Example:

```
Server unavailable
```


UI:

```
Unable to load products

[Retry]
```


Retry is handled using React Query refetch.


---

# Scroll Restoration


Problem:

User scrolls:

```
Product 40
```

Open details page.

Return back.


Without restoration:

```
Top of page
```


With restoration:

```
Product 40 position restored
```


Implementation:

```
sessionStorage
+
window.scrollTo()
```

---

# Accessibility


Implemented:

## Product List

```html
aria-label="Product list"
```


## Loading Status

```html
aria-live="polite"
```

## Images

```html
alt="Product name"
```

Benefits:

- Screen reader support
- Better accessibility compliance

---

