# Scalable Node.js Architecture (TypeScript + PM2 + Nginx)

A production-style scalable Node.js backend architecture using:

- TypeScript
- Express.js
- PM2 Cluster Mode
- Nginx Load Balancer
- Multiple Backend Instances
- Health Checks
- Graceful Shutdown
- Stress Testing with 1000+ Concurrent Requests

## Architecture

```
                         Client Requests

                              |
                              |

                         +---------+
                         |  Nginx  |
                         | Load    |
                         |Balancer |
                         +----+----+

                              |

        --------------------------------------------

        |                  |                       |

   Node Instance 1   Node Instance 2       Node Instance 3

     Port 3001         Port 3002             Port 3003

        |                  |                       |

        --------------------------------------------

                              |

                       Node.js Application

                              |

                    Database / Redis Cache

```
# Prerequisites

Install:

- Node.js >= 18
- npm
- PM2
- Nginx
 
# Running Application

## Development Mode

```bash
npm run dev
```
Application:

```
http://localhost:3000
```
---

# API Endpoints


## Root API

```
GET /
```

Response:

```json
{
    "message":"Server running",
    "pid":12345
}
```

## Health Check

```
GET /api/health
```

Response:

```json
{
    "status":"UP",
    "pid":12345,
    "uptime":120,
    "timestamp":"2026-07-15T10:00:00"
}
```
## Users API

```
GET /api/users
```

Response:

```json
{
    "users":[
        "John",
        "Alex"
    ],
    "pid":12345
}
```

# Running Multiple Backend Instances

Start servers:

Terminal 1:

```bash
PORT=3001 node dist/server.js
```
Terminal 2:

```bash
PORT=3002 node dist/server.js
```
Terminal 3:

```bash
PORT=3003 node dist/server.js
```

# PM2 Cluster Setup

Start PM2:

```bash
pm2 start ecosystem.config.js
```
Check processes:

```bash
pm2 list
```

View logs:

```bash
pm2 logs
```
Monitor:

```bash
pm2 monit
```
Restart:

```bash
pm2 restart typescript-api
```
Save PM2 configuration:

```bash
pm2 save
```
Enable startup:

```bash
pm2 startup
```

# Nginx Load Balancer Setup

Install nginx:

```bash
sudo apt install nginx
```
Configuration:

```
nginx/nginx.conf
```
Test nginx:

```bash
sudo nginx -t
```
Restart:

```bash
sudo systemctl restart nginx
```


# Testing Load Balancing

Run:

```bash
curl localhost/api/health
```

Multiple requests should return different process IDs:

Example:

```json
{
"pid":1234
}
```

Next request:

```json
{
"pid":5678
}
```
This confirms Nginx is distributing traffic.

# Graceful Shutdown
Application handles:

- SIGTERM
- SIGINT

Test:

```bash
pm2 restart typescript-api
```
Logs:

```
Shutdown signal received

HTTP server closed

New worker started

```


# Error Handling

Global error middleware:

```
src/middleware/error.middleware.ts
```
Handles:

- Application errors
- Invalid requests
- Internal server errors

# Load Testing

```bash
npm install -g autocannon
```
Run stress test:

```bash
autocannon \
-c 1000 \
-d 60 \
http://localhost/api/users
```

# Load Test Script
Run:

```bash
node tests/load-test.js
```
# Monitoring During Stress Test
PM2 monitoring:

```bash
pm2 monit
```
Monitor:

- CPU usage
- Memory usage
- Worker processes
- Restarts








