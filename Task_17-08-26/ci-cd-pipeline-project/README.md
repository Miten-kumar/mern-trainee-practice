# CI/CD Pipeline Project

A small full-stack app (React frontend + Express backend) set up with a complete GitHub Actions
pipeline: lint and test on every PR, build Docker images, auto-deploy to staging on merge,
run smoke tests, and then a manually-approved production deploy with automatic rollback if
something goes wrong.

This started as a coding challenge but it's built to actually work — clone it, wire up a couple
of secrets, and you've got a real pipeline.

## Project structure

```
.
├── frontend/                  React + Vite app
│   ├── src/
│   ├── Dockerfile             multi-stage build, served via nginx
│   ├── nginx.conf
│   └── package.json
├── backend/                    Express API
│   ├── src/
│   │   ├── routes/             /health and /api/version
│   │   ├── app.js              express app (kept separate from the server so it's testable)
│   │   └── index.js             server bootstrap
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/
│   ├── ci.yml                  runs on every PR: lint + test + docker build check
│   ├── deploy-staging.yml      runs on merge to main: build, push, deploy, smoke test
│   ├── deploy-production.yml   manual dispatch, gated behind approval, auto rollback on failure
│   └── rollback.yml            manual rollback for staging or production, any time
├── scripts/
│   ├── smoke-test.sh           hits /health and / after every deploy
│   └── rollback.sh             emergency manual rollback if Actions is down
├── docker-compose.yml           local dev / mirrors how staging & prod actually run
└── docs/
```

## Running it locally

You need Docker and Node 20+.

Quickest way, with Docker Compose:

```bash
docker compose up --build
```

Frontend will be on `http://localhost:8080`, backend on `http://localhost:4000`.

Or run each service directly if you're actively developing:

```bash
# backend
cd backend
npm install
npm run dev

# frontend, in another terminal
cd frontend
npm install
npm run dev
```

## How the pipeline works

### 1. Pull requests → `ci.yml`

Every PR against `main` triggers lint + tests for both services in parallel, plus a Docker
build check (build only, no push — just making sure the Dockerfiles aren't broken). There's a
`ci-passed` job at the end that just aggregates the results, so you only need to set one
required status check in branch protection instead of five.

### 2. Merge to main → `deploy-staging.yml`

The moment something lands on `main`, this builds both images, tags them with the short commit
SHA, pushes them to GHCR, and deploys to staging over SSH using `docker compose pull && up -d`.
After the deploy, `scripts/smoke-test.sh` hits `/health` on both services with a few retries to
account for the containers taking a moment to come up. If smoke tests fail, the workflow just
fails loudly right now — staging isn't customer-facing, so there's no automatic rollback here,
but you'll see it in the Actions tab and can re-run the rollback workflow if needed.

### 3. Production → `deploy-production.yml`

This one's manual on purpose. You pick the image tag that already got tested on staging (the
short SHA, e.g. `sha-a1b2c3d`) and trigger the workflow with `workflow_dispatch`. It:

1. Pauses at an `approval-gate` job tied to the `production` GitHub environment. Whoever you've
   set as a required reviewer on that environment has to click approve in the Actions UI before
   anything happens.
2. Grabs whatever tag is currently live and saves it, so we know what to roll back to.
3. Deploys the new image.
4. Runs smoke tests.
5. If smoke tests fail, it automatically rolls back to the previous tag and re-verifies with
   smoke tests again.

If you'd rather trigger production deploys off of GitHub Releases instead of manual dispatch,
there's a commented-out `release: types: [published]` trigger at the top of the file — swap it
in if that fits your release process better.

### 4. Rollback

There are three ways to roll back, depending on the situation:

- **Automatic**: if a production smoke test fails right after a deploy, `deploy-production.yml`
  rolls back on its own. You don't have to do anything except check the alert.
- **Manual, from GitHub**: run the `Manual Rollback` workflow (`rollback.yml`), pick the
  environment and the tag you want to go back to. This is for when a problem shows up later,
  not immediately after deploying.
- **Manual, from the server**: if GitHub Actions itself is having issues, SSH into the box and
  run `scripts/rollback.sh <tag>` directly. It does the same `docker compose pull/up` dance and
  updates `current-tag.txt`.

The important bit that makes all of this possible: every deploy writes the tag it just deployed
into `current-tag.txt` on the server, so we always know what "previous" means.

## Environment setup you'll need

**Repo secrets** (Settings → Secrets and variables → Actions):

| Secret | Used for |
|---|---|
| `STAGING_HOST`, `STAGING_SSH_USER`, `STAGING_SSH_KEY` | SSH access to the staging box |
| `PROD_HOST`, `PROD_SSH_USER`, `PROD_SSH_KEY` | SSH access to the production box |
| `SLACK_WEBHOOK_URL` (optional) | notifications on failed smoke tests / rollbacks |

`GITHUB_TOKEN` is provided automatically and is enough to push to GHCR.

**Repo variables**:

| Variable | Used for |
|---|---|
| `STAGING_API_BASE_URL` | baked into the frontend build so it knows where the staging API lives |

**GitHub Environments** (Settings → Environments): create `staging` and `production`. On
`production`, turn on "required reviewers" and add whoever should be approving prod deploys.
That's what actually creates the approval gate — the workflow file just references the
environment.

## A note on the deploy target

The workflows assume you're deploying to a plain box running Docker Compose over SSH, since
that's the simplest thing to demo end-to-end. If you're actually running Kubernetes or ECS, swap
the `appleboy/ssh-action` steps in `deploy-staging.yml` / `deploy-production.yml` for
`kubectl set image` / `aws ecs update-service` calls — everything else (the approval gate, the
tag tracking, the smoke tests, the rollback logic) stays the same.

## Testing

```bash
cd backend && npm test
cd frontend && npm test
```

Backend tests use Jest + Supertest against the Express app directly (no server needs to be
running). Frontend tests use Vitest + React Testing Library.
