# stage 1: install only production dependencies (no nodemon etc)
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# stage 2: final image, just the app + prod node_modules, nothing else
FROM node:20-alpine

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
