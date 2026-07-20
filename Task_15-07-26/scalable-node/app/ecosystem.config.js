// two separate "backend instances" on different ports, so nginx has
// more than one server to load balance across - and each one uses PM2
// cluster mode internally so it also spreads across CPU cores.
// this is basically simulating 2 small servers, each multi-core.
module.exports = {
  apps: [
    {
      name: "api-3001",
      script: "./server.js",
      exec_mode: "cluster",
      instances: 2,
      env: { PORT: 3001 },
    },
    {
      name: "api-3002",
      script: "./server.js",
      exec_mode: "cluster",
      instances: 2,
      env: { PORT: 3002 },
    },
  ],
};
