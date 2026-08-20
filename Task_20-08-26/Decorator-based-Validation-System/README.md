# Decorator-Based Validation System

A TypeScript-based validation system built with custom decorators and Express.js.

The project demonstrates:

- Property-based validation decorators
- Custom validation decorators
- Automatic DTO transformation
- Method-level authentication and role guards
- Express route integration
- Type-safe API communication
- React frontend integration
- Centralized error handling

---

## Technology Stack 

Backend
Node.js
Express.js
TypeScript
Reflect Metadata
CORS

Frontend
React
TypeScript
Vite
Axios
CSS

---

## Backend Running
npm run dev
http://localhost:5000

## Frontend Running
npm run dev
http://localhost:5173

---

## Features

1. Property Validators
Validation rules are implemented using TypeScript decorators.

Available validators include:

```typescript
@IsRequired()
@IsString()
@IsEmail()
```
2. Custom Decorators
The project implements custom business validation using decorators.
ex: - @IsAdult()
      age!: number;

3. Automated DTO Transformation 
Incoming Express request bodies are automatically transformed into DTO instances.
The transformation decorator converts:
age "25"  into:  25  (string into numbers)

4. Method Guards 
Method-level guards are implemented using decorators.

@AuthGuard()                  
@RoleGuard("admin")

Example:

@AuthGuard()
@RoleGuard("admin")
async deleteUser(
  req: Request,
  res: Response
): Promise<void> {
  // controller logic
}

5. Express Integration 
Decorators and validation are integrated into Express routes through middleware.

--- 

##  API Endpoints 

# Health Check 
http://localhost:5000/health

## Base URL
http://localhost:5000/api/v1

Create User  POST /users
Get User     GET /users
Get User     GET /users/:id
Update User  PUT /users/:id
Delete User  DELETE /users/:id

## Testing Method Guards
without authentication 
curl -X DELETE \
http://localhost:5000/api/v1/users/USER_ID

with authentication
curl -X DELETE \
http://localhost:5000/api/v1/users/USER_ID \
-H "Authorization: Bearer admin-token"

---