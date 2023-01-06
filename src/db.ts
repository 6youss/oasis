import { Pool } from "pg";
// Create a new PostgreSQL connection pool
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "oasis",
  password: "postgres",
  port: 5432,
});
