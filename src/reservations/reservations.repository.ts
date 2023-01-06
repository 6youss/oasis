import { pool } from "../infrastructure/db";

export class ReservationsRepository {
  async getAll() {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM reservations");
    const reservations = result.rows;
    client.release();
    return reservations;
  }

  async getReservationsRange(resourceId: string, startTime: string, endTime: string) {
    const client = await pool.connect();
    // Check if the resource is available for the requested time period
    const availabilityResult = await client.query(
      "SELECT * FROM reservations WHERE resource_id = $1 AND start_time <= $2 AND end_time >= $3",
      [resourceId, endTime, startTime]
    );
    const reservations = availabilityResult.rows;
    client.release();
    return reservations;
  }

  async insertReservation(startTime: string, endTime: string, rate: string, resourceId: string, customerId: string) {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO reservations (start_time, end_time, rate, resource_id, customer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [startTime, endTime, rate, resourceId, customerId]
    );
    const reservation = result.rows[0];
    client.release();
    return reservation;
  }
}
