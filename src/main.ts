import { Auth0Adapter } from "./infrastructure/auth/auth0.adapter";
import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { ExpressServer } from "./infrastructure/http/express.adapter";
import { ConsoleLogger } from "./infrastructure/logger/console.port";
import { MbCbImplementation } from "./infrastructure/message-broker/cb.port";
import { wsApp } from "./infrastructure/ws";
import { ReservationController } from "./reservation/reservation.controller";
import { ReservationPostgresRepository } from "./reservation/reservation.repository";
import { ReservationService } from "./reservation/reservation.service";

const logger = new ConsoleLogger();

const oauth = new Auth0Adapter({
  issuer: "https://dev-7ocdn8vhuo20ldrv.us.auth0.com/",
  authorization_endpoint: "https://dev-7ocdn8vhuo20ldrv.us.auth0.com/authorize",
  token_endpoint: "https://dev-7ocdn8vhuo20ldrv.us.auth0.com/oauth/token",
  jwks_uri: "https://dev-7ocdn8vhuo20ldrv.us.auth0.com/.well-known/jwks.json",
});

const server = new ExpressServer(logger, oauth);
const messageBroker = new MbCbImplementation();
const postgresAdapter = new PostgresAdapter(logger);

const reservationsRepository = new ReservationPostgresRepository(postgresAdapter);
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
