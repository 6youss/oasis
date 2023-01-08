import { PostgresAdapter } from "../infrastructure/db/postgres.adapter";

export class ReservationsRepository {
  constructor(private db: PostgresAdapter) {}

  async getAll() {
    const reservations = await this.db.query("SELECT * FROM reservations");
    return reservations;
  }

  async getReservationsRange(resourceId: string, startTime: string, endTime: string) {
    // Check if the resource is available for the requested time period
    const availabilityResult = await this.db.query(
      "SELECT * FROM reservations WHERE resource_id = $1 AND start_time <= $2 AND end_time >= $3",
      [resourceId, endTime, startTime]
    );
    return availabilityResult;
  }

  async insertReservation(startTime: string, endTime: string, resourceId: string, customerId: string) {
    const result = await this.db.query(
      "INSERT INTO reservations (start_time, end_time, resource_id, customer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [startTime, endTime, resourceId, customerId]
    );
    const reservation = result[0];
    return reservation;
  }
}
