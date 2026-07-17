# Production Debugging Process

## Project Overview

This project demonstrates identifying and fixing common production backend issues:

- Memory leaks
- Event loop blocking
- Race conditions

Technology:

- Node.js
- TypeScript
- Express
- Worker Threads
- Async Mutex
- Jest
- Autocannon
- Chrome DevTools


---

# 1. Debugging Workflow

The debugging process followed these steps:

1. Reproduce the issue
2. Monitor application behavior
3. Collect profiling data
4. Identify root cause
5. Implement a fix
6. Run performance tests
7. Compare before and after results


---

# 2. Memory Leak Issue


## Symptoms

- Memory usage continuously increases
- Application becomes slower over time
- Node.js heap keeps growing


## Investigation

Tools used:

- Chrome DevTools Heap Snapshot
- Node.js Memory Profiler


Steps:

1. Start application with inspector:
