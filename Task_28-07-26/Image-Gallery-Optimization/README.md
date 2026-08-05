## Image Gallery Optimization & Lazy Loading

A full-stack **Image Gallery Optimization System** built using **React + TypeScript + Node.js + Express + Sharp**.

This project demonstrates modern image optimization techniques:
- Lazy loading
- Responsive images (`srcset`)
- WebP/JPEG format support
- Sharp image transformation
- Blur-up placeholders
- CLS prevention
- Lightbox modal
- LCP optimization

---

# Project Overview

The application displays an optimized image gallery where images are dynamically processed by the backend using Sharp.

flow:

Frontend (React)
|
|
v
Axios API Request
|
|
v
Backend (Express)
|
|
v
Sharp Image Processing
|
|
v
Optimized WebP/JPEG Image
|
|
v
Gallery UI

---

## Tech Stack

## Frontend

- React.js
- TypeScript
- Vite
- Axios
- CSS
- React Hooks

## Backend

- Node.js
- Express.js
- TypeScript
- Sharp
- REST API
---

## Backend setup
npm run dev
http://localhost:3001

## Frontend setup
npm run dev
http://localhost:5173

## API Endpoints
GET
/api/images
http://localhost:3001/api/images

GET
/api/images/:id/transform
/api/images/mountain/transform?w=640&fmt=webp

## Implemented Features
1. Responsive Images
2. webp support
3. Lazy Loading 
4. sharp image optimization
5. blur placeholder
6. CLS prevention
7. Lightbox

## Performance Optimization 
Before optimization:

Large JPEG
|
|
Slow Loading
|
|
Layout Shift

After optimization:

Small WebP
|
|
Lazy Loading
|
|
No CLS
|
|
Fast Rendering

--- 

Testing
Backend Test

Open:

http://localhost:3001/api/images

Image test:

http://localhost:3001/api/images/mountain/transform?w=640&fmt=jpeg
Frontend Test

Open:

http://localhost:5173

Check:

Gallery loads
Images appear
Click image opens lightbox
Different formats load
Performance Testing

Chrome DevTools:

DevTools
    |
    |
Lighthouse
    |
    |
Performance Audit

Check:

Largest Contentful Paint (LCP)
Cumulative Layout Shift (CLS)
Image optimization
Future Improvements
AVIF format support
BlurHash placeholders
Image upload system
Cloudinary/Image CDN integration
Image caching
Progressive JPEG loading
Infinite scrolling gallery

