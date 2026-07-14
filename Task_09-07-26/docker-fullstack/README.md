# Dockerized Full Stack App

React + Node/Express notes app, backed by Postgres and cached with Redis.
Two Docker setups: one for development (hot reload) and one for
production (optimized multi-stage builds).

## Structure

```
backend/
  src/
    server.js       - express app, notes API
    db.js            - postgres pool
    redis.js          - redis client
  Dockerfile.dev       - dev image, nodemon hot reload
  Dockerfile             - prod image, multi-stage, prod deps only
frontend/
  src/
    App.jsx           - notes UI
  Dockerfile.dev       - dev image, vite dev server
  Dockerfile             - prod image, multi-stage build -> nginx
  nginx.conf              - serves the built app, proxies /api to backend
db/
  init.sql            - creates the notes table on first postgres start
docker-compose.yml      - development stack
docker-compose.prod.yml - production stack
.env.example
```

## Running it

**Development** (hot reload on both frontend and backend):
```
cp .env.example .env
docker-compose up --build
```
- frontend: http://localhost:5173
- backend: http://localhost:5000/api/health
- postgres: localhost:5432
- redis: localhost:6379

Edit a file in `frontend/src` or `backend/src` and it reloads automatically
— both containers mount the source folder as a volume.

**Production** (optimized builds, nginx serving static files):
```
docker-compose -f docker-compose.prod.yml up --build
```
- everything through http://localhost (port 80) — nginx serves the built
  React app and proxies `/api/*` to the backend container internally

## How each piece works

**Hot reload in dev**
`docker-compose.yml` mounts `./backend:/app` and `./frontend:/app` as
volumes, so file changes on your machine show up inside the container
immediately. `backend/Dockerfile.dev` runs `nodemon` (restarts on file
change), `frontend/Dockerfile.dev` runs the vite dev server (has its own
built-in hot module reload). The `/app/node_modules` anonymous volume in
each service stops the bind mount from wiping out the `node_modules`
that got installed inside the image.

**Optimized production builds**
Both prod Dockerfiles are multi-stage:
- backend: one stage installs only production deps (`npm install
  --omit=dev`, skips nodemon etc), final image just copies that
  `node_modules` + source, nothing else
- frontend: one stage runs `npm run build` to produce static files,
  final image is just `nginx:alpine` with those static files copied in —
  no Node.js at all in the final image, way smaller than shipping the
  whole build toolchain

**Postgres + Redis**
Notes are stored in Postgres. `GET /api/notes` checks Redis first — if
there's a cached list it returns that (`source: "cache"` in the
response), otherwise queries Postgres and caches the result for 30
seconds. Adding a note (`POST /api/notes`) invalidates the cache so the
next read is fresh. `db/init.sql` runs automatically the first time the
postgres container starts (via `docker-entrypoint-initdb.d`), so the
table exists before the backend ever queries it.

**Networking between containers**
Services talk to each other by service name — the backend connects to
`postgres:5432` and `redis:6379`, not `localhost`, because docker-compose
puts every service in the same network with those names as DNS entries.
In production, the frontend's nginx proxies `/api/*` to `backend:5000`
internally — the backend container has no port published to the host at
all in `docker-compose.prod.yml`, it's only reachable through nginx.

## What I could and couldn't verify here

I don't have Docker Hub access in this environment (network policy
blocks it), so I couldn't actually run `docker-compose up` end-to-end.
What I did verify instead:
- installed real Postgres + Redis locally and ran `backend/src/server.js`
  directly against them — confirmed notes save correctly, cache hits/misses
  work as expected, and cache invalidation on write works
- `npm run build` on the frontend completes with no errors
- both `docker-compose.yml` and `docker-compose.prod.yml` parse as valid
  YAML with the expected services

You'll want to run `docker-compose up --build` yourself as the first real
test — if anything's off (e.g. a version mismatch pulling images), it'll
show up in the build/pull step immediately.
