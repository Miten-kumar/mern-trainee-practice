## Multi-Step Checkout State Machine

A production-oriented multi-step checkout system built with React, TypeScript, XState, Node.js, Express, Prisma, and PostgreSQL.

The checkout flow is modeled as a state machine to handle cart → shipping → payment → confirmation, including payment failures, retries, back navigation, API errors, and persisted checkout data

## Technologies 

Frontend
React
TypeScript
Vite
XState
@xstate/react
Axios
CSS

Backend
Node.js
Express
TypeScript
Prisma
PostgreSQL
CORS
Zod/environment validation

---

## How to Run 
backend 
npm run dev
http://localhost:5000

frontend
npm run dev
http://localhost:5173

---

## XState Visulize Diagram 

             ┌──────────────┐
             │     CART     │
             └──────┬───────┘
                    │ NEXT
                    ▼
             ┌──────────────┐
             │   SHIPPING   │
             └──────┬───────┘
                    │ SUBMIT
                    ▼
             ┌──────────────┐
             │   PAYMENT    │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ PROCESSING   │
             └───┬──────┬───┘
                 │      │
             SUCCESS   ERROR
                 │      │
                 ▼      ▼
        ┌──────────┐ ┌──────────────┐
        │CONFIRMATION│ │PAYMENT ERROR│
        └──────────┘ └──────┬───────┘
                            │ RETRY
                            ▼
                       PROCESSING


## Checkout Flow

1. cart 

Initial state:
cart
User sees the product and clicks:
Continue to Shipping

2. shipping

User enters:

First Name
Last Name
Address
City
State
Pincode
Phone

3. Payment

User can select:

UPI
CARD

Payment state:

payment
   ↓
processingPayment

Successful payment:
processingPayment
   ↓
confirmation

4. Confirmation

After successful payment:

Order Confirmed

Payment was successful.

Order ID:
ORDER-XXXXXXXX

5. Payment error handling 

When payment fails:

processingPayment
        ↓
paymentError

The UI displays:
Payment Failed

Payment failed
Retry attempts: 1/3

[ Retry Payment ]
[ Back to Payment ]

--- 

## Payment retry
Maximum retry count:

3

Example:

First failure
Retry attempts: 1/3

       ↓ Retry

Second failure
Retry attempts: 2/3

       ↓ Retry

Third failure
Retry attempts: 3/3

After maximum retries:
Maximum retry attempts reached.
Retry button is disabled/hidden.

## Back Navigation 
The state machine supports back navigation.

--- 

## API Endpoints 

Base URL:
/api/v1

Create Checkout
POST /checkout

Get Checkout
GET /checkout/:id

Update Shipping
PATCH /checkout/:id/shipping

Process Payment
POST /checkout/:id/payment

Retry Payment
POST /checkout/:id/payment/retry

--- 

## XState State Machine
Main states:

cart
creatingCheckout
shipping
updatingShipping
shippingError
payment
processingPayment
paymentError
retryingPayment
confirmation
checkoutError

## State Persistence

The frontend state machine manages the current UI state while the backend persists checkout information in PostgreSQL.

---


