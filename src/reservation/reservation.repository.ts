import { PostgresAdapter } from "../infrastructure/db/postgres.adapter";

/**
 * A Model represents a table in the database.
 */
export interface ReservationModel {
  id: number;
  start_time: Date;
  end_time: Date;
  resource_id: number;
  customer_id: number;
}

export interface ReservationRepository {
  getAll: () => Promise<ReservationModel[]>;
  getReservationsRange: (resourceId: string, startTime: string, endTime: string) => Promise<ReservationModel[]>;
  insertReservation: (startTime: string, endTime: string, resourceId: string, customerId: string) =>  Promise<ReservationModel>;
}

export class ReservationPostgresRepository implements ReservationRepository {
  constructor(private db: PostgresAdapter) {}

  async getAll() {
    const reservations = await this.db.query<ReservationModel>("SELECT * FROM reservations");
    return reservations;
  }

  async getReservationsRange(resourceId: string, startTime: string, endTime: string) {
    const availabilityResult = await this.db.query<ReservationModel>(
      "SELECT * FROM reservations WHERE resource_id = $1 AND start_time <= $2 AND end_time >= $3",
      [resourceId, endTime, startTime]
    );
    return availabilityResult;
  }

  async insertReservation(startTime: string, endTime: string, resourceId: string, customerId: string) {
    const [reservation] = await this.db.query<ReservationModel>(
      "INSERT INTO reservations (start_time, end_time, resource_id, customer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [startTime, endTime, resourceId, customerId]
    );
    return reservation;
  }
}


