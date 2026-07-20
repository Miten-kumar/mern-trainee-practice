const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// tells us which process actually answered - useful for seeing
// nginx spread requests across the different backends/workers
app.get("/health", (req, res) => {
  res.json({ status: "ok", pid: process.pid, port: PORT });
});

app.get("/", (req, res) => {
  res.json({ message: "hello from the api", pid: process.pid, port: PORT });
});

// fake some real work so the stress test actually has something to
// measure instead of just hitting an instant response every time
app.get("/work", (req, res) => {
  const start = Date.now();
  let total = 0;
  while (Date.now() - start < 20) {
    total += Math.random();
  }
  res.json({ result: total, pid: process.pid, port: PORT });
});

const server = app.listen(PORT, () => {
  console.log(`worker ${process.pid} listening on port ${PORT}`);
});

// when pm2 (or nginx during a deploy) tells this process to stop, don't
// just kill it mid-request - stop taking new connections, let whatever
// is already in progress finish, then exit
function shutdown(signal) {
  console.log(`${signal} received, worker ${process.pid} shutting down gracefully...`);

  server.close(() => {
    console.log(`worker ${process.pid} finished in-flight requests, exiting`);
    process.exit(0);
  });

  // safety net - if something's stuck and connections never close,
  // don't hang forever, just force it after a few seconds
  setTimeout(() => {
    console.log(`worker ${process.pid} taking too long to close, forcing exit`);
    process.exit(1);
  }, 5000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
