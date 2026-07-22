# Job Application Form (Multi-Step)

Small learning project - a multi step job application form.

- `frontend/` - React + TypeScript + Vite, React Hook Form + Zod, plain CSS
- `backend/` - Node + Express, multer for file upload, saves data to a json file (no real db)

## Features
- 5 step form (Personal Info, Background, Certifications, Documents, Review)
- Conditional fields (employed vs student shows different fields)
- Dynamic fields (add/remove certifications)
- File upload (resume required, photo optional)
- Saves progress to localStorage so refreshing the page doesn't lose your data
- Basic accessibility (labels, aria-invalid, aria-describedby, live region for step)

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

Make sure backend is running first, frontend calls it on submit.

## Running tests

Backend (jest + supertest, tests the API route):
```
cd backend
npm install
npm test
```

Frontend (vitest, tests the zod validation schema):
```
cd frontend
npm install
npm test
```

## Other

`INTERVIEW_QUESTIONS.md` in the root has a list of questions you might get
asked about this project, grouped by topic (architecture, validation, file
uploads, testing, accessibility, etc).
