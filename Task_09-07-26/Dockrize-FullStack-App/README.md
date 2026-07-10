# Docker Full Stack Application
A full-stack application containerized using Docker.  
This project contains a React frontend, Node.js + TypeScript backend, PostgreSQL database, and Redis service managed using Docker Compose.

---

## Tech Stack

### Frontend
- React.js
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- REST API

### Database
- PostgreSQL 16

### Cache
- Redis 7

### DevOps
- Docker
- Docker Compose
- Container Networking
- Volume Management

---

#  Docker Architecture

```
                 Browser
                    |
                    |
              React Container
              Port: 5173
                    |
                    |
             Node.js API Container
             Port: 5000
                    |
                    |
          ---------------------
          |                   |
 PostgreSQL Container     Redis Container
 Port:5432               Port:6379

```
---

# Features

- React frontend containerization
- Node.js TypeScript backend
- PostgreSQL database integration
- Redis service setup
- Docker Compose orchestration
- Container networking
- Environment variables
- Development hot reload
- Persistent database storage

---

# ```bash
docker --version

docker compose version
```
---
Prerequisites

Install:

- Docker
- Docker Compose

Check installation:

---

#  Run Application

Start containers:

```bash
sudo docker compose up --build
```

For background mode:

```bash
sudo docker compose up -d
```
---

---

#  Application URLs

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

API:

```
http://localhost:5000/api/users
```

---

#  Database Setup

PostgreSQL container:

```
Database: myapp
User: admin
Password: password
Port: 5432
```

Access PostgreSQL:

```bash
sudo docker exec -it dockrize-fullstack-app-postgres-1 psql -U admin -d myapp
```

Create users table:

```sql
CREATE TABLE users(
 id SERIAL PRIMARY KEY,
 name VARCHAR(100),
 email VARCHAR(100) UNIQUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Check tables:

```sql
\dt
```

---

#  Docker Commands

## View running containers

```bash
sudo docker ps
```

## Stop containers

```bash
sudo docker compose down
```

## Rebuild images

```bash
sudo docker compose up --build
```

## View logs

Backend:

```bash
sudo docker compose logs backend
```

Frontend:

```bash
sudo docker compose logs frontend
```

---

# Development Workflow

Frontend changes:

```
React Code
    |
    |
Frontend Container
    |
    |
Vite Hot Reload
```

Backend changes:

```
TypeScript Code
       |
       |
Node Container
       |
       |
API Restart
```

---

# Services

| Service | Technology | Port |
|---------|------------|------|
| Frontend | React + Vite | 5173 |
| Backend | Node + Express | 5000 |
| Database | PostgreSQL | 5432 |
| Cache | Redis | 6379 |

---




