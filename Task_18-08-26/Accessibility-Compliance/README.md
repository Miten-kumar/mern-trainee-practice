# Accessibility Compliance

A production-ready accessibility implementation for a React + TypeScript frontend and Node.js + Express + TypeScript backend.

The project audits and improves accessibility for a complex component by implementing:

- Keyboard navigation
- ARIA labels and roles
- Focus management
- Focus trapping and restoration
- Color contrast and high-contrast mode
- Reduced-motion support
- Screen reader announcements
- Automated accessibility testing
- Manual screen-reader testing with Orca/NVDA/VoiceOver

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Axios
- Vitest
- Testing Library
- jest-axe
- axe-core

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL

## Accessibility

- WCAG-oriented implementation
- ARIA
- Keyboard navigation
- Focus management
- Live regions
- High contrast
- Reduced motion
- Screen readers

---

## Run Backend
npm run dev
http://localhost:5000

## Run Frontend
npm run dev
http://localhost:5173

## Type Checking & Run Tests
npm run type-check
npm run test or npm run test:run
---

## Manual Keyboard Testing

| Test                     | Expected Result                         |
| ------------------------ | --------------------------------------- |
| Press `Tab`              | Focus moves to next interactive element |
| Press `Shift + Tab`      | Focus moves backward                    |
| Press `Enter`            | Button/action activates                 |
| Press `Space`            | Toggle activates                        |
| Open modal               | Focus moves into modal                  |
| Press `Tab` inside modal | Focus remains inside                    |
| Press `Shift + Tab`      | Focus remains inside                    |
| Press `Escape`           | Modal closes                            |
| Close modal              | Focus returns to trigger                |

---

## API Endpoints 
GET http://localhost:5000/api/v1/health
GET /api/v1/accessibility/preferences
PUT /api/v1/accessibility/preferences

## Screen Reader Testing
Linux - Orca

Linux does not support NVDA or VoiceOver.
The native Linux screen reader is Orca.

Test:
Accessible button names
Headings
Dialog
Live announcements
Keyboard navigation
Focus changes

## Browser Accessibility Inspection
Use browser DevTools to inspect:

Elements
   ↓
Accessibility

Verify:
Accessible Name
Role
ARIA attributes
Focusable state
Keyboard focus

## Network Verification

Open:
DevTools → Network

On Page load
GET /api/v1/accessibility/preferences
PUT /api/v1/accessibility/preferences

## Focus Management
When a modal opens:

View Details
     ↓
Modal opens
     ↓
Focus moves inside modal

## Skip Navigation
A skip link allows keyboard users to bypass repetitive content.
Skip to main content

## Color Contrast 
The implementation provides:

Strong text/background contrast
Visible keyboard focus
Accessible button colors
High-contrast mode
Status information that is not communicated by color alone

## High Contrast Mode
Users can enable high contrast mode.

Normal:
High Contrast: Off

After activation:
High Contrast: On

## Reduced Motion
The application respects the user's reduced-motion preference.

## SCreen Reader Anouncements
Dynamic changes are announced using an ARIA live region.

----


