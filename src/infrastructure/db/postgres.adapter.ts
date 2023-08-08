import { Pool } from "pg";
import { Logger } from "../logger/logger.port";

export class PostgresAdapter {
  private pool: Pool | undefined;

  constructor(private logger: Logger) {}

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
    const startTime = new Date().getTime();
    const result = await client.query(q, params);
    const endTime = new Date().getTime();
    this.logger.log(`${q}; ${endTime - startTime}ms`);
    client.release();
    return result.rows as T[];
  }

  getPool() {
    return this.pool;
  }
}
