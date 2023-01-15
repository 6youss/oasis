import { PostgresAdapter } from "../infrastructure/db/postgres.adapter";
import { HttpServer } from "../infrastructure/http/http.adapter";
import { MessageBroker } from "../infrastructure/message-broker/message-broker.adapter";
import { ReservationController } from "./reservation.controller";
import { ReservationPostgresRepository } from "./reservation.repository";
import { ReservationService } from "./reservation.service";

export function registerReservationRoutes(server: HttpServer, pg: PostgresAdapter, mb: MessageBroker) {
  const reservationsRepository = new ReservationPostgresRepository(pg);
  const reservationsService = new ReservationService(reservationsRepository, mb);
  reservationsService.subscribeToNewReservations();
  const reservationsController = new ReservationController(reservationsService);

  /**
   * @openapi
   * /reservations:
   *   get:
   *     description: get all reservations
   *     responses:
   *       200:
   *         description: returns all the made reservations
   */
  server.registerRoute({
    path: "/reservations",
    method: "get",
    controller: reservationsController.getAll,
    private: true,
  });

  /**
   * @openapi
   * /reservations:
   *   post:
   *     summary: Create a new reservation
   *     responses:
   *       201:
   *         description: returns the created reservation
   *         content:
   *           application/json:
   *             schema:
   *                 $ref: '#/components/schemas/Reservation'
   */
  server.registerRoute({
    path: "/reservations",
    method: "post",
    controller: reservationsController.createReservation,
  });

  /**
   * @openapi
   * components:
   *   schemas:
   *     Reservation:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           description: The user ID.
   *           example: 0
   *         name:
   *           type: string
   *           description: The user's name.
   *           example: Leanne Graham
   */
}
