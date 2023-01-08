import { Pool } from "pg";

export class PostgresAdapter {
  private pool: Pool | undefined;

  constructor() {}

  async init() {
    this.pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "oasis",
      password: "postgres",
      port: 5432,
    });
  }

  async query<T>(q: string, params?: any[]) {
    if (!this.pool) {
      throw new Error("db not initilized, please call init() before");
    }
    const client = await this.pool.connect();
    console.time(q);
    const result = await client.query(q, params);
    console.timeEnd(q);
    client.release();
    return result.rows as T[];
  }

  getPool() {
    return this.pool;
  }
}
