import pg from "pg";

const { Pool } = pg;

// these env vars get set by docker-compose - falling back to localhost
// values here just makes it possible to run the backend directly with
// `npm run dev` against a local postgres too, without docker
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "notesdb",
});
