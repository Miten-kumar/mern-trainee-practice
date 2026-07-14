# Redis Caching Layer

Small e-commerce products API with Redis handling caching, cache
stampede protection, sessions, and rate limiting. No real database —
products live in an in-memory array, since the point of this task is the
Redis layer, not building a full backend.

## Structure

```
server.js                    - wires everything together
src/
  redisClient.js               - redis connection
  data.js                       - fake in-memory product "db"
  utils/
    cacheLock.js                 - cache get/set with stampede lock
  middleware/
    rateLimiter.js                - fixed-window rate limiter
    session.js                     - session create/check/destroy
  routes/
    products.js                    - product CRUD + caching
    auth.js                         - login/logout/me
```

## Running it

```
npm install
npm start
```
Needs a redis instance running on `localhost:6379` (or set `REDIS_HOST`/
`REDIS_PORT` env vars). If you don't have redis installed locally, the
quickest way is `docker run -p 6379:6379 redis:7-alpine`.

## How each requirement was implemented

**Cache product lists**
`GET /api/products` goes through `getOrSetCache()` — checks Redis for
`products:all` first, only calls `fetchProductsFromDB()` (deliberately
slowed down with an 800ms delay to make timing differences visible) on a
miss, then caches the result for 30 seconds.

**Cache invalidation on updates**
`POST`/`PUT`/`DELETE` on `/api/products` all call `invalidateCache()`
after writing, which just does `redis.del("products:all")`. Next `GET`
after any write rebuilds the cache from scratch instead of serving stale
data.

**Cache stampede protection**
If ten requests hit an empty cache at the same time, without protection
all ten would hit the "database" simultaneously. `cacheLock.js` handles
this with a redis lock (`SET lock:products:all NX PX 5000` — only
succeeds for one caller). Whoever gets the lock fetches and fills the
cache; everyone else polls the cache key every 100ms until it appears
instead of also querying the db. If the lock holder crashes, the lock
expires after 5 seconds so things don't jam forever.

**Session management**
`POST /api/auth/login` creates a random session id, stores
`{ username }` in Redis under `session:<id>` with a 30 minute TTL, and
returns the id. Protected routes use `requireSession` middleware — reads
`x-session-id` header, looks it up in Redis, 401s if missing/expired.
Every successful check also refreshes the TTL (sliding expiration), so
an active session doesn't die mid-use.

**Rate limiting**
Fixed-window counter: `INCR ratelimit:<ip>`, first hit in the window
sets a 60 second expiry, requests over 20 in that window get a 429 with
a `retryAfterSeconds` telling them when the window resets.

## Manually verifying it (already tested against a real redis instance)

- First `GET /api/products` takes ~800ms (`source: "db"`), every one
  after that within 30s is near-instant (`source: "cache"`)
- Firing 5 concurrent requests at an empty cache — only 1 shows
  `source: "db"`, the other 4 show `"cache"` (they waited for the lock
  holder instead of all hitting the db)
- `POST /api/products` then `GET /api/products` right after — new
  product shows up immediately and `source` is `"db"` again, proving the
  cache actually got cleared
- Hitting `/api/products` 25 times in a row — first 20 return 200, the
  rest return 429
- `POST /api/auth/login` → `GET /api/auth/me` with the returned
  `x-session-id` works, without it returns 401, and after
  `POST /api/auth/logout` the same session id returns 401 again
