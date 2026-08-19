# REST vs GraphQL — Same API, Two Ways

I built this to actually answer a question I kept seeing debated online:
*when does GraphQL's extra complexity pay for itself over REST?* Instead of
just reading opinions, I built the same backend twice — once as REST, once
as GraphQL — on top of identical data, hit the N+1 problem on purpose, fixed
it with DataLoader, and measured the difference.

It's a small blog-style API (users, posts, comments) with JWT auth on both
sides, plus a React frontend that runs both APIs side by side so you can
watch the request counts differ in real time.

## What's in here

```
graphql-vs-rest-analysis/
├── backend/          Express app exposing REST under /api and GraphQL at /graphql
├── frontend/         React (Vite) app that hits both APIs from the same UI
└── docs/
    ├── TRADEOFFS.md            when I'd actually reach for each one
    └── performance-results.md  the numbers behind the comparison
```

## Quick start

You need Node 18+ (I used Node 22).

```bash
# terminal 1 — backend
cd backend
npm install
cp .env.example .env
npm start
# → REST API      http://localhost:4000/api
# → GraphQL API   http://localhost:4000/graphql

# terminal 2 — frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Open the frontend, log in with `aarav@example.com` / `password123` (any
seeded user + `password123` works), and click "Load feed" on both panels.
Each one shows how many HTTP requests it took and how long it took.

Want the raw numbers instead of the UI?

```bash
cd backend
npm run perf
```

This hits the running server three ways (REST naive, REST optimized,
GraphQL) and prints a comparison table. Full explanation of the output is in
[`docs/performance-results.md`](docs/performance-results.md).

## Why a simulated database

There's no Postgres/Mongo here on purpose. `backend/src/db/simulateDb.js` is
an in-memory store that adds a small artificial delay to every "query" and
counts how many queries happen per request. That's what makes the N+1
problem something you can actually measure (query count, not just a
feeling that "REST felt slower") without needing anyone to spin up a real
database just to try this out. Swapping it for a real driver would mean
rewriting the functions in `backend/src/db/data.js` — the REST routes and
GraphQL resolvers don't know or care that the data isn't in a real table.

## The N+1 problem, in this codebase

`GET /api/posts` returns posts with just an `authorId` — no author name, no
comments. To render a normal feed (title, author name, comment count), a
REST client ends up doing this:

```
GET /api/posts                 → 12 posts
GET /api/users/u1               ┐
GET /api/posts/p1/comments      ├─ repeated once per post
GET /api/users/u2                │
GET /api/posts/p2/comments      ┘
...
```

12 posts → 25 requests. That's `backend/src/rest/routes/posts.routes.js` →
`GET /`, paired with the naive-fetch logic in
`frontend/src/components/RestDemo.jsx` and `backend/scripts/perf-test.js`.

The REST fix I went with is a hand-built `/api/posts/feed` endpoint that
joins author + comment count server-side — one request, but now there's an
endpoint that exists for exactly this one screen (see `TRADEOFFS.md` for why
that's not free either).

The GraphQL fix is `Post.author` and `Post.comments` resolvers backed by
[DataLoader](https://github.com/graphql/dataloader)
(`backend/src/graphql/dataloaders.js`), which batches every `.load(id)` call
made during a single request into one query. Same nested data, one request,
and — this is the part that actually matters — the *database* only gets hit
3 times instead of 25, no matter how many posts are on the page.

## API reference

### REST — `/api`

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | — | `{ name, email, password }` |
| POST | `/auth/login` | — | `{ email, password }` → `{ token, user }` |
| GET | `/users` | — | all users |
| GET | `/users/:id` | — | one user |
| GET | `/users/:id/posts` | — | posts by that user |
| GET | `/posts` | — | all posts, no author/comment data (the N+1 setup) |
| GET | `/posts/feed` | — | posts joined with author + comment count |
| GET | `/posts/:id` | — | one post |
| GET | `/posts/:id/comments` | — | comments on a post |
| POST | `/posts` | ✅ | `{ title, body }` |
| POST | `/posts/:postId/comments` | ✅ | `{ text }` |

Send the JWT as `Authorization: Bearer <token>`.

### GraphQL — `/graphql`

Open `http://localhost:4000/graphql` in a browser for the interactive
schema explorer (Apollo Sandbox) once the server's running. Rough shape:

```graphql
type Query {
  me: User
  users: [User!]!
  user(id: ID!): User
  posts: [Post!]!
  post(id: ID!): Post
}

type Mutation {
  register(name: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  createPost(title: String!, body: String!): Post!
  createComment(postId: ID!, text: String!): Comment!
}
```

Full schema: `backend/src/graphql/typeDefs.js`.

Example query — the one the frontend and perf script both use:

```graphql
query Feed {
  posts {
    id
    title
    author { name }
    comments { id text author { name } }
  }
}
```

## Auth, on both sides

Same JWT, same secret, same seeded users — `backend/src/auth/auth.js` is the
one place that signs/verifies tokens and checks passwords, and both the REST
middleware (`rest/middleware/authMiddleware.js`) and the GraphQL context
(`graphql/context.js`) call into it. I did this on purpose: auth logic
living in two different places is how you end up with REST and GraphQL
quietly disagreeing about who's logged in.

## Trade-offs

The short version is in [`docs/TRADEOFFS.md`](docs/TRADEOFFS.md) — REST still
wins on HTTP caching, simplicity for small APIs, and debuggability with
standard tools; GraphQL wins once you have multiple clients with different
data needs or deeply nested data, but only if you actually put in the
DataLoader work, otherwise you've just hidden the N+1 problem behind a
single HTTP request instead of solving it.

## What I'd add with more time

- A real database (Postgres + Prisma) instead of the in-memory store, to see
  whether the performance gap holds under real query latency instead of a
  fixed simulated delay
- GraphQL subscriptions for live comment updates
- Query complexity / depth limiting on the GraphQL side (right now nothing
  stops a client from asking for `posts { comments { author { posts { ... } } } }`
  a few levels deep)
- Tests — this was built and manually verified end to end (register → login
  → authenticated mutations on both APIs, `npm run perf`), but there's no
  automated test suite yet

