import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend runs on :4000 (REST under /api, GraphQL at /graphql).
// This proxy lets the frontend just call relative paths in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/graphql': 'http://localhost:4000',
    },
  },
});
