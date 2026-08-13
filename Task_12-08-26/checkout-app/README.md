# NODE — Checkout State Machine

A checkout flow (`cart → shipping → payment → confirmation`) modeled as a
finite state machine with **XState v5**, split into a real frontend/backend:

```
checkout-app/
  frontend/   React + Vite + XState — the UI and the state machine itself
  backend/    Express API — payment simulation, order storage, session persistence
```

## Run it

Two terminals:

```bash
# Terminal 1 — backend (http://localhost:4000)
cd backend
npm install
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The header shows `api connected` once the
frontend can reach the backend; if the backend isn't running it falls back
to `api offline` after a few seconds and you can still click through the UI
(payment/persistence calls will just fail gracefully).

## Why it's split this way

- **`frontend/`** owns the state machine (`src/machine/checkoutMachine.js`)
  and all the step UIs. It decides *when* transitions are allowed to happen
  (form validation, cart-not-empty guards) — that's presentation logic and
  belongs on the client.
- **`backend/`** owns anything that shouldn't be trusted to the client: the
  actual payment decision (delay + decline simulation), the resulting order
  record, and the durable copy of an in-progress checkout session. A real
  payment gateway integration would slot in at `backend/src/routes/payment.routes.js`
  without the frontend needing to change.

## Backend API

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/payment/charge` | Simulates a gateway charge (delay + ~25% random decline, or forced via `simulateFailure`). On success, creates and stores an order. |
| `GET` | `/api/orders/:orderId` | Fetch a stored order. |
| `GET` | `/api/orders` | List all orders (most recent first). |
| `GET` | `/api/checkout/session/:sessionId` | Fetch a persisted xstate snapshot for that session. |
| `PUT` | `/api/checkout/session/:sessionId` | Save the current snapshot (called on every transition). |
| `DELETE` | `/api/checkout/session/:sessionId` | Clear a session ("reset demo"). |

Storage is a plain in-memory `Map` (`backend/src/store/memoryStore.js`) — deliberately
not a real database, since the point is the state machine, not persistence
infrastructure. Swap that file for a Redis/Postgres/Mongo-backed version and
nothing else needs to change.

## Frontend structure

```
frontend/src/
  api/client.js          fetch wrapper for the backend
  machine/
    checkoutMachine.js    state machine — cart, shipping, payment, processingPayment,
                           paymentError, paymentFailed, confirmation
    persist.js            session id (localStorage) + snapshot save/load (backend)
  components/
    StepperHeader.jsx      4-step progress bar
    CartStep / ShippingStep / PaymentStep .jsx
    ProcessingStep / PaymentErrorStep / PaymentFailedStep .jsx
    ConfirmationStep.jsx
    MachineVisualizer.jsx  live state graph + context + transition log
    Field.jsx
  App.jsx                 resolves the session before mounting the machine
  Checkout.jsx             wires the machine to the UI via @xstate/react
```

### What the machine covers

- **Guarded transitions** — can't leave `cart` empty, can't leave
  `shipping`/`payment` with invalid fields.
- **Async payment** — `processingPayment` invokes a promise actor that calls
  the backend's `/api/payment/charge`.
- **Errors & retry** — a decline goes to `paymentError` with the reason shown;
  up to 3 retries (`context.retryCount`), then an automatic (`always`)
  transition to the terminal `paymentFailed` state.
- **Back navigation** — `shipping → cart`, `payment → shipping`,
  `paymentError → payment` (edit card).
- **Persistence** — the actor's snapshot is pushed to the backend on every
  transition and restored on load, so a refresh mid-checkout resumes exactly
  where you left off (server-side, not just `localStorage`).
- **Visualization** — a node graph of every state (active node pulses,
  completed nodes dim, the error branch lights up on decline), a redacted
  live JSON view of `context`, and a scrolling transition log.

## Stack

- Frontend: React 19, Vite, `xstate` + `@xstate/react` (v5), Tailwind CSS v4
- Backend: Node.js, Express, CORS — no database, in-memory store
