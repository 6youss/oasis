import { OAuth } from "./infrastructure/auth/auth.port";
import { KeycloakAdapter } from "./infrastructure/auth/keycloak.adapter";
import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { ExpressServer } from "./infrastructure/http/express.adapter";
import { HttpServer } from "./infrastructure/http/http.port";
import { ConsoleLogger } from "./infrastructure/logger/console.adapter";
import { Logger } from "./infrastructure/logger/logger.port";
import { MbCbAdapter } from "./infrastructure/message-broker/cb.adapter";
import { MessageBroker } from "./infrastructure/message-broker/message-broker.port";
import { wsApp } from "./infrastructure/ws";
import { ReservationController } from "./reservation/reservation.controller";
import { PostgresReservationRepository } from "./reservation/reservation.repository";
import { ReservationService } from "./reservation/reservation.service";

const logger: Logger = new ConsoleLogger();

const keycloakOauth: OAuth = new KeycloakAdapter({
  issuer: `http://localhost:8080/realms/Tricksept`,
  audience: `oasis-api`,
  jwksUri: `http://localhost:8080/realms/Tricksept/protocol/openid-connect/certs`,
});

const server: HttpServer = new ExpressServer(logger, keycloakOauth);
const messageBroker: MessageBroker = new MbCbAdapter();
const postgresAdapter = new PostgresAdapter(logger);

const reservationsRepository = new PostgresReservationRepository(postgresAdapter);
const reservationsService = new ReservationService(reservationsRepository, messageBroker, logger);
reservationsService.subscribeToNewReservations();
const reservationsController = new ReservationController(reservationsService);

server.registerRoute({
  path: "/reservations",
  method: "get",
  private: true,
  controller: reservationsController.getAll,
});

server.registerRoute({
  path: "/reservations",
  method: "post",
  controller: reservationsController.createReservation,
});

// init database
postgresAdapter.init();

// start http server
const httpPort = 3000;
server.start(httpPort).then(() => {
  logger.log(`Server listening at http://localhost:${httpPort}`);
});

// start websocket server
const wsPort = 9001;
wsApp.listen(wsPort, (listenSocket) => {
  if (listenSocket) {
    logger.log(`Websocket server listening to port ${wsPort}`);
  }
});
