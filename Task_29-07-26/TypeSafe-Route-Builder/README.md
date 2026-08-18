# Type Safe Route Builder

A full-stack TypeScript application that demonstrates a **type-safe routing system** using TypeScript template literal types.

The goal of this project is to build a routing architecture where routes, parameters, and query parameters are validated at compile time instead of runtime.

---

# Features

## 1. Type-Safe Route Management

- Centralized route definitions
- Prevent invalid route strings
- Route autocomplete support
- Compile-time route validation

Example:

```ts
/users/:id
```

Generated safely:

```text
/users/10
```
---

## 2. Type Safe Route Parameters

Dynamic routes support validated parameters.

Example:

Route:

```text
/users/:id
```
Input:

```ts
{
 id:10
}
```
Generated URL:

```text
/users/10
```
---

## 3. Query Parameter Validation

Products page demonstrates validated query parameters.

Example:

```text
/products?category=electronics&sort=asc
```

Supported:

- category
- sorting
- filtering

---

## 4. Route Builder Playground

Interactive UI to generate routes.

Supported examples:

### User Route

```text
/users/:id
```

Output:

```text
/users/1
```

### Product Route

```text
/products/:id
```

Output:

```text
/products/5
```

### Product Query Route

```text
/products?category=&sort=
```

Output:

```text
/products?category=electronics&sort=asc
```

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

## Database

- PostgreSQL 


---

#  API Endpoints

## Users

### Get Users

```
GET /api/users
```
---

## Products

### Get Products

```
GET /api/products
```
---

### Filter Products

Example:

```
GET /api/products?category=electronics
```
---

### Sort Products

Example:

```
GET /api/products?sort=desc
```
---

#  Application Flow

```
React Frontend

      |

      ↓

Axios API Layer

      |

      ↓

Express Backend

      |

      ↓

Service Layer
      |

      ↓

Prisma ORM

      |

      ↓

PostgreSQL Database

```
---


