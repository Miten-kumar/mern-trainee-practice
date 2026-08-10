# Job Queue System

A small async job processing system built with [Bull](https://github.com/OptimalBits/bull)
(a Redis-backed queue library for Node.js). Two queues - email sending
and image processing - with retries, priorities, progress tracking,
and a way to scale up workers.

This is a learning project, kept intentionally small and dependency-light.

---

## Table of contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running it](#running-it)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [How each requirement is handled](#how-each-requirement-is-handled)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Architecture

```
                 ┌──────────────┐
   HTTP request  │  API server  │  POST /api/jobs/email
  ─────────────► │  (server.js) │  POST /api/jobs/image
                 └──────┬───────┘  GET  /api/jobs/:queue/:id
                        │          GET  /api/jobs/:queue/stats
                        │ adds job to queue
                        ▼
                 ┌──────────────┐
                 │    Redis     │  <- Bull stores all job state here
                 └──────┬───────┘
                        │ worker(s) pick up jobs
                        ▼
                 ┌──────────────┐
                 │    Worker    │  processes jobs (worker.js)
                 │  process(es) │  run more of these to scale up
                 └──────────────┘
```

The API server and the worker are **two separate processes** that both
talk to the same Redis instance. The API server never processes a job
itself - it only adds jobs to the queue and reads their status back out
of Redis. This separation is what lets you scale processing
independently: if jobs are piling up, start more worker processes
without touching the API server at all.

## Prerequisites

- Node.js 18+
- Redis running locally (or reachable over the network)

### Installing Redis

Pick whichever is easiest for you:

**macOS (Homebrew)**
```
brew install redis
brew services start redis
```

**Linux (apt)**
```
sudo apt-get install redis-server
sudo service redis-server start
```

**Docker (any OS, no local install needed)**
```
docker run -d --name job-queue-redis -p 6379:6379 redis:7-alpine
```

**Windows**
Easiest option is Docker (above), or WSL + the Linux instructions.

Check it's running with:
```
redis-cli ping
```
should reply `PONG`.

## Setup

```
cd backend
npm install
```

That's the only install needed - the frontend is a plain static HTML
page with no build step.

## Running it

You need **three things running at once**, each in its own terminal:

**1. Redis** (see above, if not already running)

**2. The API server**
```
cd backend
npm run dev
```
Runs on http://localhost:4000

**3. At least one worker**
```
cd backend
npm run worker
```
This is the process that actually sends the "emails" and "processes"
the "images". Without it running, jobs will just sit in the queue as
`waiting` forever - the API server only enqueues them, it doesn't
process them.

**Optional: the dashboard**

`frontend/index.html` is a plain HTML file, open it directly in a
browser (or serve it with any static file server, e.g.
`npx serve frontend`). It talks to the API at `http://localhost:4000`.

### Scaling up workers

Open another terminal and run `npm run worker` again. Bull coordinates
through Redis, so multiple worker processes will never pick up the
same job twice - jobs just get spread across however many workers are
running. You can also increase how many jobs a *single* worker handles
at once:

```
WORKER_CONCURRENCY=5 npm run worker
```

## Environment variables

| Variable            | Default                   | Used by        | What it does                                      |
|----------------------|---------------------------|-----------------|----------------------------------------------------|
| `PORT`                | `4000`                     | API server      | Port the HTTP API listens on                       |
| `REDIS_URL`           | `redis://127.0.0.1:6379`   | API + worker    | Where Redis is running                              |
| `WORKER_CONCURRENCY`  | `2`                         | Worker          | How many jobs one worker process runs at the same time, per queue |

## API reference

All responses are JSON. Base URL: `http://localhost:4000`.

### Queue an email job

```
POST /api/jobs/email
Content-Type: application/json

{
  "to": "someone@example.com",
  "subject": "Welcome!",
  "body": "Thanks for signing up.",
  "priority": "high"        // optional: "high" | "normal" | "low", defaults to "normal"
}
```

```
curl -X POST http://localhost:4000/api/jobs/email \
  -H "Content-Type: application/json" \
  -d '{"to":"someone@example.com","subject":"Welcome!","body":"Thanks for signing up."}'
```

Response `201`:
```json
{ "jobId": "1", "queue": "email" }
```

### Queue an image processing job

```
POST /api/jobs/image
Content-Type: application/json

{
  "imageUrl": "https://example.com/photo.jpg",
  "priority": "low"          // optional
}
```

Response `201`:
```json
{ "jobId": "2", "queue": "image" }
```

### Check a job's status

```
GET /api/jobs/:queueName/:id
```
`queueName` is `email` or `image`.

```
curl http://localhost:4000/api/jobs/email/1
```

Response `200`:
```json
{
  "id": "1",
  "state": "active",
  "progress": 50,
  "attemptsMade": 1,
  "failedReason": null,
  "result": null,
  "data": { "to": "someone@example.com", "subject": "Welcome!", "body": "Thanks for signing up." }
}
```

`state` is one of: `waiting`, `active`, `completed`, `failed`, `delayed`
(delayed = waiting for a retry backoff timer).

### Queue stats

```
GET /api/jobs/:queueName/stats
```

```json
{ "queue": "email", "counts": { "waiting": 2, "active": 1, "completed": 14, "failed": 1, "delayed": 0 } }
```

### Failed jobs

```
GET /api/jobs/:queueName/failed
```

```json
{
  "queue": "image",
  "failed": [
    { "id": "7", "data": { "imageUrl": "..." }, "attemptsMade": 3, "failedReason": "Image processing failed during \"compressing\" step for ..." }
  ]
}
```

## How each requirement is handled

**Email sending queue / Image processing queue** - two separate Bull
queues (`queues/emailQueue.js`, `queues/imageQueue.js`), each with its
own processor function (`processors/emailProcessor.js`,
`processors/imageProcessor.js`) that simulates the actual work (no
real email provider or image library wired up, this is a learning
project - swapping in a real one just means replacing the body of the
processor function).

**Retry mechanisms** - every job gets `attempts: 3` with exponential
backoff (`utils/defaultJobOptions.js`), so a failed job is retried up
to 2 more times with an increasing delay between attempts (2s, then
4s), instead of retrying instantly and hammering whatever failed.

**Job priorities** - the API accepts a friendly `"high"/"normal"/"low"`
string and maps it to Bull's numeric priority (`utils/priority.js`,
lower number = processed first in Bull).

**Progress tracking** - both processors call `job.progress(percent)`
at each step of their (simulated) work, which the status endpoint
reads back out.

**Worker scaling** - the worker is a separate process
(`workers/worker.js`) from the API server on purpose. Run it more than
once, or raise `WORKER_CONCURRENCY`, to process more jobs at the same
time - see [Scaling up workers](#scaling-up-workers) above.

**Handle failures gracefully** - jobs that exhaust all retry attempts
end up in Bull's `failed` state (not silently dropped) and stay
queryable via `GET /api/jobs/:queueName/failed`, along with the actual
error message and how many attempts were made. The worker also logs
every failure to the console as it happens.

## Project structure

```
backend/
  app.js                 - express app setup
  server.js               - starts the HTTP API
  config/redis.js          - shared redis connection url
  queues/
    emailQueue.js           - email queue definition
    imageQueue.js            - image queue definition
  processors/
    emailProcessor.js        - simulated "send an email" job logic
    imageProcessor.js         - simulated "process an image" job logic
  workers/worker.js         - attaches processors to queues, run this to process jobs
  routes/jobs.js            - the REST API
  utils/
    priority.js               - friendly priority name -> bull priority number
    defaultJobOptions.js       - shared retry/backoff/cleanup settings
  tests/                    - jest tests (queues are mocked, no redis needed to run them)

frontend/
  index.html               - plain HTML dashboard, no build step
  app.js                    - form submission + status polling
  style.css
```

## Testing

The tests mock the Bull queues entirely, so you do **not** need Redis
running to run the test suite:

```
cd backend
npm install
npm test
```

What's covered:
- `tests/priority.test.js` - the priority name -> number mapping
- `tests/jobs.routes.test.js` - the API routes (validation, correct
  queue calls, status/stats/failed responses), queues mocked with jest
- `tests/processors.test.js` - the actual job logic in both
  processors, including the simulated failure paths (`Math.random` is
  mocked so both the success and failure branches are actually
  exercised, not left to chance)

## Troubleshooting

**Jobs stay stuck in "waiting" forever**
The worker process isn't running. The API server only adds jobs to the
queue, it doesn't process them - run `npm run worker` in a separate
terminal.

**`ECONNREFUSED` when starting the server or worker**
Redis isn't running, or `REDIS_URL` points somewhere wrong. Check with
`redis-cli ping`.

**A job is stuck in "failed" and I want to retry it manually**
This project doesn't expose a manual-retry endpoint (kept out to keep
things simple), but you can do it directly from a Node REPL:
```js
const emailQueue = require('./backend/queues/emailQueue');
emailQueue.getJob('<id>').then((job) => job.retry());
```

**I changed `WORKER_CONCURRENCY` but nothing seems different**
Make sure you restarted the worker process after setting it - it's
only read once, when the worker starts up.
