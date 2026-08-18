### Optimized Search Component
The goal of this project is to deliver a production-like autocomplete experience while minimizing unnecessary API requests and database queries.

## Overview 
This project implements an optimized autocomplete search component using React, TypeScript, Express.js, Prisma ORM, and PostgreSQL. The application provides fast and responsive search suggestions with debounced API calls, request cancellation, keyboard navigation, highlighted matches, loading states, and empty states.

## Tech Stack
Frontend
React 19
TypeScript
Vite
Axios

Backend
Node.js
Express.js
TypeScript
Prisma ORM
PostgreSQL

## Features 
1. Optimized autocomplete search
2. Debounced API requests (300ms)
3. Request cancellation using AbortController
4. Loading skeleton while fetching results
5. Keyboard navigation
   Arrow Up
   Arrow Down
   Enter
   Escape
6. Highlight matching search text
7. Empty state for no search results
8. Case-insensitive search
9. Top 10 search suggestions
10. PostgreSQL database integration
11. Indexed database search for improved performance 

## Backend Setup

Install Dependencies
npm install
Configure Environment Variables

Create a .env file inside the backend directory.

DATABASE_URL="postgresql://postgres:password@localhost:5432/optimized_search?schema=public"

PORT=5000

## Generate prisma client 
npx prisma generate

## Run database migration 
npx prisma migrate dev
Seed Database
npx prisma db seed

## Start Backend
npm run dev

Backend runs at:
http://localhost:5000

## Frontend Setup
Install Dependencies
npm install

## Start Frontend 
npm run dev

Frontend runs at:

http://localhost:5173

## API Endpoints 

## Search Products 
GET /api/search?q=laptop

## Response should like 
{ "success": true, "count": 2, "data": [ { "id": 1, "name": "Apple MacBook Pro", "category": "Laptop", "description": "Powerful laptop", "createdAt": "2026-07-27T10:00:00.000Z" } ] }

## How it works 

1. User enters text

The user types inside the search box.

2. Debounce

The application waits for 300ms before sending an API request.

This prevents unnecessary API calls while the user is typing.

3. Request Cancellation

If the user types again before the previous request completes, the previous request is cancelled using AbortController.

Only the latest search request updates the UI.

4. Backend Search

The backend searches PostgreSQL using Prisma with a case-insensitive query and returns a maximum of 10 matching products.

5. Display Results

Matching products are displayed in an autocomplete dropdown.

Matching text is highlighted.

## Keyboard Navigation 
Supported keyboard controls:

Key	Action
Arrow Down ---> Move to next suggestion
Arrow Up ---->	Move to previous suggestion
Enter ---->	Select highlighted suggestion
Escape ----> Clear search input

## Loading State 
A loading skeleton is displayed while the search request is in progress.
This provides immediate feedback and improves perceived responsiveness.

## Empty State 
If no products match the search query, the application displays:
No products found
instead of showing an empty dropdown.

## Database Optimization 
The backend optimizes database queries using:

Indexed search column
Case-insensitive filtering
Maximum of 10 search suggestions
Prisma ORM

## Performance Optimization 
Debounced API calls
Request cancellation
Limited database results
Indexed database search
Loading skeletons for better perceived responsiveness
Efficient React rendering
Lightweight autocomplete dropdown
