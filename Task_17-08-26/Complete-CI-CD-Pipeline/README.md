# Complete CI/CD Pipeline

A production-ready CI/CD pipeline for a TypeScript-based full-stack application using React, Node.js, Express, PostgreSQL, Prisma, Docker, and GitHub Actions.

The pipeline automates testing, linting, Docker image building, staging deployment, smoke testing, production approval, production deployment, and rollback.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- Vitest
- Testing Library
- ESLint
- Nginx

### Backend

- Node.js
- TypeScript
- Express.js
- Prisma
- PostgreSQL
- Vitest
- ESLint

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- GitHub Container Registry (GHCR)

---

## Application Architecture
  Browser
                     │
                     ▼
              React Frontend
                 Port 5173
                     │
                   Axios
                     │
                     ▼
              Express Backend
                 Port 5000
                     │
                   Prisma
                     │
                     ▼
                PostgreSQL
                 Port 5432

--- 

## CI/CD Architecture

                   GitHub
                      │
                Pull Request
                      │
          ┌───────────┴───────────┐
          │                       │
       Frontend                 Backend
        Tests                    Tests
        Lint                     Lint
        Build                   Build
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
                Merge to main
                      │
                      ▼
              Docker Image Build
                      │
                      ▼
           GitHub Container Registry
                      │
                      ▼
               Staging Deploy
                      │
                      ▼
                Smoke Tests
                      │
                 ┌────┴────┐
                 │         │
                PASS      FAIL
                 │         │
                 ▼         ▼
        Production       Stop
          Approval
                 │
                 ▼
        Production Deploy
                 │
                 ┴──┐
              │     │
           Success Failure
              │     │
              ▼     ▼
            Done  Rollback

--- 

## How To Run
backend - npm run dev
http://localhost:5000

frontend - npm run dev
http://localhost:5173

## API Endpoints
curl http://localhost:5000/api/v1/health

---

## Testing 
npm test

## Linting
npm run lint

## Run Docker compose
docker compose up -d
docker compose ps

---

## Docker Image build
After code is merged into `main`, GitHub Actions:

1. Checks out the repository
2. Logs into GitHub Container Registry
3. Builds backend Docker image
4. Builds frontend Docker image
5. Tags images with the Git commit SHA
6. Pushes images to GHCR
7. Also maintains a `latest` tag

Example:

```text
ghcr.io/<github-user>/<repository>/backend:<commit-sha>

ghcr.io/<github-user>/<repository>/frontend:<commit-sha>
```

Commit SHA tags make deployments traceable and support rollback.

---

# Rollback Procedure

Rollback is required when a production deployment fails or causes unexpected behavior.
The workflow supports a manual rollback trigger.
Run the GitHub Actions workflow using:

```text
workflow_dispatch
```

and set:

```text
rollback = true
```
---
