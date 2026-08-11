## Production Logging System

A production-ready logging and monitoring system built with React, TypeScript, Node.js, Express, Prisma, PostgreSQL, and Winston.

The system provides structured application logging, correlation ID based request tracing, PII redaction, performance monitoring, application error tracking, and critical alert generation.

## Task Overview
The goal of this project is to implement a centralized production logging and monitoring system for a full-stack application.

The application tracks:

Application logs
Request correlation IDs
API performance
Response times
Application errors
Critical errors
Critical alerts
Sensitive information redaction
Database connectivity
Application health
Log files and log rotation

A React dashboard displays the monitoring information collected by the backend.

## Monitoring & Logging 
Structured logging
Correlation IDs
PII redaction
Performance metrics
Application error tracking
Critical alerting
Log rotation

---

## Running Backend
npm run dev
http://localhost:5000

## Running Frontend
npm run dev
http://localhost:5173

---

## Winston Logging 
Winston is used as the main backend logging library.

The application supports different log levels:
error, warn, info, http, debug

1. Structured Logging 
Instead of writing unstructured messages:

User created

the application creates structured log information:

{
  "level": "info",
  "message": "User created successfully",
  "userId": 10,
  "correlationId": "47bbb211-4a3d-4837-a1e7-ea06949a002c",
  "timestamp": "2026-08-11T10:30:00.000Z"
}

2. Correlation IDs
Every request receives a unique correlation ID.

Example:

47bbb211-4a3d-4837-a1e7-ea06949a002c

The ID is added to the request:

X-Correlation-ID: 47bbb211-4a3d-4837-a1e7-ea06949a002c

3. PII Redaction
Sensitive information must never be written to logs.
{ "email": "[REDACTED]", "password": "[REDACTED]" }

4. Performance Metrics 
The backend records API performance information such as:

HTTP method
Route
Status code
Response time
Correlation ID
Timestamp

5. Application Error Tracking 
Application errors are captured by the global error middleware.

Example:

GET /api/invalid-route

6. Critical Alerting 
Critical errors can generate alerts.

For example:

HTTP 500
     ↓
Application Error
     ↓
Critical Error
     ↓
Alert Rule
     ↓
AlertEvent

Example alert:

CRITICAL
Critical server error detected
Alert information includes:

Alert type
Severity
Message
Threshold
Actual value
Correlation ID
Created timestamp
Resolved status

---

## Log Rotation 
Log rotation prevents log files from consuming unlimited disk space.

## API Endpoints
Health endpoint:
GET /api/health

Performance Metrics
GET /api/monitoring/metrics

Application Errors
GET /api/monitoring/errors

Critical Alerts
GET /api/monitoring/alerts

## Test Application Error
Send a request to an invalid route:
curl http://localhost:5000/api/invalid-route

## Test Critical Errors
Trigger a server-side 500 error.

Expected flow:

500 Error
   ↓
Winston
   ↓
ApplicationError
   ↓
Critical Alert
   ↓
AlertEvent
   ↓
Frontend Dashboard

Frontend should display:
Application Errors

1 Critical

Critical Alerts
1 Active Alert

---