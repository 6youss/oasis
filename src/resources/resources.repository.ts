import { pool } from "../infrastructure/db";

export class ResourcesRepository {
  async getAll() {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM resources");
    const resources = result.rows;
    client.release();
    return resources;
  }
}
