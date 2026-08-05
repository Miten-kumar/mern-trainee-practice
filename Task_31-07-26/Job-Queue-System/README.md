# Job Queue System

A full-stack asynchronous job processing system built using **Bull Queue, Redis, PostgreSQL, Prisma, Node.js, Express, React, and TypeScript**.

The system handles background tasks like:
- Email sending
- Image processing
- Job retry mechanism
- Priority based processing
- Progress tracking
- Failure handling
- Worker scaling

---

# Features

## Backend Features
Node.js + Express + TypeScript  
PostgreSQL database  
Prisma ORM  
bull Queue with Redis  
Email processing queue  
Image processing queue  
retry mechanism  
Job priority handling  
Job progress tracking  
Worker based architecture  
Error handling and failure tracking  

## Frontend Features
React + TypeScript  
Job dashboard  
Create Email Jobs  
Upload Image Jobs  
Real-time job status updates  
Progress bar tracking  
Completed / Failed job states  

---

# System Architecture


```
                React Frontend
                      |
                      |
              REST API Requests
                      |
                      |
              Express Backend
                      |
        -----------------------------
        |                           |
        |                           |
   PostgreSQL                  Bull Queue
      |                            |
      |                            |
   Prisma ORM                    Redis
                                   |
                          ----------------
                          |              |
                    Email Worker   Image Worker
                          |
                          |
                    Background Tasks
```
---

# Start Workers

## Email Worker
```
npm run worker:email
```
## Image Worker
```
npm run worker:image
```
---

# API Endpoints

## Create Email Job

POST
```
/api/jobs/email
```
---

## Create Image Job

POST
```
/api/jobs/image
```
---

## Get All Jobs

GET
```
/api/jobs
```
---

## Get Job Status

GET
```
/api/jobs/:id
```
---

# Job Lifecycle

```
WAITING

   |

   ↓

ACTIVE

   |

   ↓

COMPLETED

```
Failure:
```
WAITING

   |

   ↓

ACTIVE

   |

   ↓

FAILED

```
---

# Retry Mechanism

Jobs support automatic retry:

Example:

```ts
{
 attempts:3,
 backoff:{
   type:"exponential",
   delay:5000
 }
}

```
Flow:
```
Job Failed

    |

Retry 1

    |

Retry 2

    |

Retry 3

    |

FAILED

```
---




