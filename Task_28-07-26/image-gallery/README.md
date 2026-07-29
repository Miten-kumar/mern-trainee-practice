# Image Gallery with Optimization

Small learning project - a responsive image gallery with a lightbox.

- `frontend/` - React + TypeScript + Vite, plain CSS
- `backend/` - Node + Express, minimal, just serves image metadata (no
  actual image files, uses picsum.photos as a free placeholder image
  service so there's something real to load)

## What it covers
- Lazy loading - images outside the viewport don't load until they
  scroll close to it (`IntersectionObserver`, plus native `loading="lazy"`
  as a backup)
- Responsive images - `srcset`/`sizes` so the browser picks an
  appropriately sized image instead of always downloading the largest one
- Blur-up placeholders - a tiny blurred version shows immediately, the
  full image cross-fades in once it's loaded
- Progressive loading - the placeholder shows first, full image loads
  only once the item is actually near the viewport, then swaps in
- WebP with fallback - `<picture>` with a WebP `<source>` and a JPEG
  `<img>` fallback for browsers that don't support WebP
- Lightbox modal - click an image to view it full size, arrow
  keys/buttons to go next/prev, Escape or backdrop click to close
- CLS measurement - a small on-screen panel using
  `PerformanceObserver`'s `layout-shift` entries to show the actual
  Cumulative Layout Shift score, plus a toggle to turn off the
  aspect-ratio reservation so you can see CLS get worse without it

## How to run

### Backend
```
cd backend
npm install
npm run dev
```
Runs on http://localhost:4000

### Frontend
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

Needs an internet connection in the browser since the demo images are
loaded from picsum.photos.

## Running tests
```
cd backend && npm install && npm test
cd frontend && npm install && npm test
```
