import { PostgresAdapter } from "../infrastructure/db/postgres.adapter";
import { HttpServer } from "../infrastructure/http/http.adapter";
import { Logger } from "../infrastructure/logger/logger.adapter";
import { MessageBroker } from "../infrastructure/message-broker/message-broker.adapter";
import { ReservationController } from "./reservation.controller";
import { ReservationPostgresRepository } from "./reservation.repository";
import { ReservationService } from "./reservation.service";

export function registerReservationRoutes(server: HttpServer, pg: PostgresAdapter, mb: MessageBroker, logger: Logger) {
  const reservationsRepository = new ReservationPostgresRepository(pg);
  const reservationsService = new ReservationService(reservationsRepository, mb, logger);
  reservationsService.subscribeToNewReservations();
  const reservationsController = new ReservationController(reservationsService);

  server.registerRoute({
    path: "/api/reservations",
    method: "get",
    controller: reservationsController.getAll,
  });

  server.registerRoute({
    path: "/api/reservations",
    method: "post",
    controller: reservationsController.createReservation,
  });
}
