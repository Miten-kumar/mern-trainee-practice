# REST vs GraphQL — trade-offs, based on this project

This isn't a generic "GraphQL is better" write-up. It's what I actually ran into
while building the same feature (a post feed with author + comments) twice —
once as REST, once as GraphQL — on top of the same data.

## The problem that started this: over/under-fetching

`GET /api/posts` returns posts with just an `authorId`. To show a feed with
author names and comment counts, a REST client has two options:

1. Call `GET /api/users/:id` and `GET /api/posts/:id/comments` for every post
   on the page. That's the N+1 pattern — 12 posts turns into 25 HTTP
   requests, each one paying full round-trip latency.
2. Ask the backend team to build a purpose-made endpoint — `GET /api/posts/feed`
   in this repo — that joins everything server-side. One request, but now
   there's an endpoint that exists for exactly one screen. Add a mobile app
   that wants less data, or a new screen that wants comments *and* likes, and
   you're back to writing more endpoints (or overfetching from `/feed` and
   throwing half of it away).

GraphQL sidesteps both problems by letting the client describe the exact
shape it needs in the query itself. One request, no unused fields, no
new backend endpoint for the next screen.

## But GraphQL doesn't remove N+1, it moves it

The naive version of `Post.author` — "look up `db.getUserById(post.authorId)`
inside the resolver" — still fires once per post. GraphQL's flexibility means
the client can ask for `author` on every post in a list, and if the resolver
doesn't batch, that's still N+1 queries, just hidden behind a single HTTP
request instead of spread across many.

The fix is [DataLoader](https://github.com/graphql/dataloader): batch every
`.load(id)` call made during the same tick into one query, and cache results
for the life of the request. In this repo:

- `graphql/dataloaders.js` — `userLoader` and `commentsByPostLoader`
- `graphql/resolvers.js` — `Post.author` and `Post.comments` call `.load()`
  instead of querying directly

Running `npm run perf` in `backend/` against the seed data (12 posts):

| Approach | HTTP requests | Simulated DB queries | Time |
|---|---|---|---|
| REST, naive (N+1) | 25 | 25 | ~300ms |
| REST, hand-built `/feed` | 1 | 25 | ~30ms |
| GraphQL + DataLoader | 1 | **3** | ~55ms |

The DB query count is the number that matters most: DataLoader collapses
"one author lookup per post" into one batched `users.findByIds` call, no
matter how many posts are on the page. The REST `/feed` endpoint gets the
request count down but still pays for 25 individual queries under the hood —
someone just wrote the loop server-side instead of client-side.

(Numbers will shift a bit run to run since the "DB" here is simulated with a
fixed per-query delay — the point is the shape of the comparison, not the
exact milliseconds.)

## Where REST still wins, in my experience

- **Caching.** REST's `GET /api/posts/:id` maps cleanly onto HTTP caching —
  CDNs, browser cache, `ETag`/`If-None-Match`, all of it works out of the
  box. GraphQL mostly goes over POST to a single `/graphql` endpoint, so you
  lose that for free; you have to build caching yourself (persisted queries,
  Apollo's cache, etc.).
- **Simplicity for small APIs.** If there are three resources and no nested
  data, REST is less to set up — no schema, no resolver layer, no
  DataLoader. This project's REST side is genuinely simpler to read for
  someone who just wants `GET /api/posts`.
- **File uploads, webhooks, anything not "fetch some JSON".** REST (or
  plain HTTP) is the natural fit; GraphQL needs extensions (`graphql-upload`,
  subscriptions for webhooks-ish behavior) to do the same things.
- **Debuggability with standard tools.** `curl`, browser network tab, and
  HTTP status codes map directly onto REST. A failed GraphQL mutation
  still comes back as `200 OK` with an `errors` array — you have to know to
  look there.
- **Rate limiting and monitoring per resource.** Easy to rate-limit
  `POST /api/comments` differently from `GET /api/posts` in REST. In
  GraphQL, both go through the same `/graphql` endpoint, so you need
  query-cost analysis to do the equivalent.

## Where GraphQL earned its complexity here

- **Multiple clients with different needs.** A mobile client that only
  wants post titles and a web client that wants full author bios and
  comment threads can send different queries against the same schema. REST
  would need `?fields=` query param hacks or separate endpoints for both.
- **Deeply nested data.** `posts { author { posts { comments { author } } } }`
  is one query. The REST equivalent is a chain of endpoint calls, each one
  waiting on the last.
- **Schema as living documentation.** `typeDefs.js` is the contract — a
  frontend dev can see every field, every type, every argument, without
  reading route handlers or Postman collections.

## The decision, stated plainly

- Small API, few resources, one client, want HTTP caching for free →
  **REST**.
- Several clients with different data needs, deeply nested/related data,
  a team that will actually maintain DataLoader batching discipline →
  **GraphQL**.
- Either way: if you pick GraphQL, budget time for DataLoader from day
  one. It's not an optional add-on — a GraphQL API without batching is
  usually *worse* than REST for the exact endpoint it was supposed to fix,
  because the N+1 cost is still there, just less visible.
