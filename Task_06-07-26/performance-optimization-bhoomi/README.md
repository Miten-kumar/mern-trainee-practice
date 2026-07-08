#  Performance Optimization Challenge
A full-stack React + TypeScript project demonstrating modern React performance optimization techniques by optimizing a slow application that renders 10,000+ items.

---

##  Objective

Optimize a slow React application by implementing:

- Virtual Scrolling for 10,000+ items
- Code Splitting using React.lazy
- Memoization (React.memo, useMemo, useCallback)
- Performance comparison (Naive vs Optimized rendering)

---

##  Features

-  Render 10,000+ products
-  Search functionality
-  Naive Rendering
-  Optimized Rendering
-  Virtual Scrolling using react-virtuoso
-  Route Code Splitting
-  React.memo
-  useMemo
-  useCallback
-  Performance Analytics Page

---

#  Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Axios
- React Router DOM
- react-virtuoso

## Backend

- Node.js
- Express.js
- TypeScript

---

## How to Run 
Backend will run on:
```
http://localhost:3001
```
Frontend will run on:
```
http://localhost:5173
```
---

#  Performance Optimizations

### Virtual Scrolling

- Displays only visible items.
- Optimizes rendering for 10,000+ records.

### React.memo

- Prevents unnecessary component re-rendering.

### useMemo

- Optimizes search filtering.

### useCallback

- Prevents recreation of callback functions.

### React.lazy

- Loads the Analytics page only when needed.

### Suspense

- Displays a loading fallback while lazy components are loading.

---


#  Pages

##  Home

- Search Products
- Toggle Rendering Mode
- Naive List
- Optimized Virtual List

##  Analytics

- Performance Report
- Optimization Summary
- Before vs After Comparison

---

# Concepts Covered

- Virtual Scrolling
- React Performance Optimization
- React.memo
- useMemo
- useCallback
- React.lazy
- Suspense
- Express REST API
- TypeScript

---