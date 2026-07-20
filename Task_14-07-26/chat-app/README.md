# Real-time Chat Application

Type-safe chat built with Socket.io — auth, rooms, typing indicators,
read receipts, message persistence, presence, and error handling that
sends the client an actual message instead of just hanging or crashing.

## Structure

```
backend/
  src/
    server.ts       - express app + socket.io, all event handlers
    types.ts          - shared Message type + typed socket event maps
    auth.ts             - token issuing + socket auth middleware
    persistence.ts        - saves/loads messages to a json file
    presence.ts              - tracks who's online in each room
  data/
    messages.json (created automatically on first message)
frontend/
  src/
    socket.ts        - typed socket client + login helper
    types.ts           - same event types, kept in sync by hand
    components/
      Login.tsx          - username entry screen
      ChatRoom.tsx          - messages, typing, presence, read receipts
```

No shared npm package between frontend/backend for the types — for a
project this size it's simpler to keep two small copies in sync by hand
than to set up a monorepo/workspace just for one shared file.

## Running it

```
cd backend
npm install
npm run dev
# http://localhost:5000

cd frontend
npm install
npm run dev
# http://localhost:5173
```

Open the frontend in two different browser tabs (or one normal + one
incognito) with different usernames to actually see presence, typing,
and read receipts working between two people.

## How each requirement was implemented

**Type safety**
`types.ts` (mirrored on both sides) defines `ClientToServerEvents` and
`ServerToClientEvents` and passes them as generics into
`new Server<...>()` on the backend and `io<...>()` on the frontend. This
means `socket.emit("send_message", ...)` is type-checked against the
actual event signature — wrong argument shapes or typos in event names
fail to compile, not just fail at runtime.

**Authentication**
`POST /api/login` takes a username, issues a random token (kept in an
in-memory `Map`), same pattern as the session-management piece from the
Redis caching task. The socket connection sends that token in
`auth: { token }`, and a socket.io middleware (`socketAuthMiddleware`)
checks it before the connection is even accepted — a bad/missing token
never gets to `connection`, it gets a `connect_error` instead.

**Rooms**
Built on socket.io's own room support (`socket.join(room)`). A separate
`presence.ts` map tracks room → socketId → username specifically for
showing an online-users list, since socket.io's rooms don't track
usernames on their own.

**Typing indicators**
Client emits `typing` on every keystroke and again (with `isTyping:
false`) 1.5 seconds after the last one, using a debounce timer that
resets on every keystroke. Server broadcasts it to everyone else in the
room with `socket.to()` so the typer doesn't see their own indicator.

**Read receipts**
When a message from someone else appears in the message list, the
client marks it read once (tracked in a ref so it doesn't fire
repeatedly on re-renders) via `mark_read`. Server broadcasts a
`read_receipt` back to the room (excluding whoever just read it) so the
original sender sees "seen by ...".

**Message persistence**
`persistence.ts` keeps messages in memory grouped by room, and
write-through saves to `data/messages.json` on every new message.
Loaded back into memory on server startup, so restarting the server
doesn't lose chat history. Verified by reconnecting a client mid-test —
`room_history` on rejoin included the earlier message.

**Presence**
`presence.ts`, described above under rooms — `presence_update` is
broadcast to a room whenever someone joins, leaves, or disconnects
entirely (socket.io's `disconnect` event triggers cleanup across every
room that socket was in, not just one).

**Graceful error handling**
Every socket event handler that can fail (join with empty room name,
sending an empty message, sending to a room you're not in) returns an
ack like `{ ok: false, error: "..." }` instead of throwing — the client
always gets a response it can show, nothing just silently fails. Handler
bodies are also wrapped in try/catch so an unexpected error becomes a
clean ack instead of crashing the connection.

## What was actually tested

I wrote a temporary Node script using `socket.io-client` to simulate two
users (not included in the final zip, just used to verify behavior)
and confirmed, against the real running server:
- both users connect and authenticate correctly
- joining a room returns `room_history` (empty on a fresh room)
- a bad/missing token gets a `connect_error`, not a silent failure
- sending a message broadcasts `new_message` to everyone in the room
- an empty message is rejected with a clear error instead of being sent
- typing events reach the other user, not the sender
- marking a message read sends a `read_receipt` back to the original
  sender specifically (not to the person who read it)
- reconnecting and rejoining the room returns the message history from
  disk, proving persistence survives a fresh connection
