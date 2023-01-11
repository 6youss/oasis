import { Router } from "express";
import { PostgresAdapter } from "../infrastructure/db/postgres.adapter";
import { makeExpressAdapter } from "../infrastructure/http/express.port";
import { MessageBroker } from "../infrastructure/message-broker/message-broker.adapter";
import { ReservationController } from "./reservation.controller";
import { ReservationPostgresRepository } from "./reservation.repository";
import { ReservationService } from "./reservation.service";

export function getReservationRoutes(pg: PostgresAdapter, mb: MessageBroker) {
  const reservationsRepository = new ReservationPostgresRepository(pg);
  const reservationsService = new ReservationService(reservationsRepository, mb);
  reservationsService.subscribeToNewReservations();
  const reservationsController = new ReservationController(reservationsService);
  const router = Router();

  /**
   * @openapi
   * /reservations:
   *   get:
   *     description: get all reservations
   *     responses:
   *       200:
   *         description: returns all the made reservations
   */
  router.get("/", makeExpressAdapter(reservationsController.getAll));

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
  router.post("/", makeExpressAdapter(reservationsController.createReservation));

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
  return router;
}
