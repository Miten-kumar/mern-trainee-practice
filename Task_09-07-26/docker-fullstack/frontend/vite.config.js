import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // needed so the dev server is reachable from outside the container
    port: 5173,
    proxy: {
      // "backend" is the service name from docker-compose.yml, docker's
      // internal DNS resolves it to the backend container's IP
      "/api": {
        target: "http://backend:5000",
        changeOrigin: true,
      },
    },
  },
});
