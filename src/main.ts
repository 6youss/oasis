import { Auth0Adapter } from "./infrastructure/auth/auth0.adapter";
import { AzureADAdapter } from "./infrastructure/auth/azure-ad.adapter";
import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { ExpressServer } from "./infrastructure/http/express.adapter";
import { ConsoleLogger } from "./infrastructure/logger/console.port";
import { MbCbAdapter } from "./infrastructure/message-broker/cb.adapter";
import { wsApp } from "./infrastructure/ws";
import { ReservationController } from "./reservation/reservation.controller";
import { ReservationPostgresRepository } from "./reservation/reservation.repository";
import { ReservationService } from "./reservation/reservation.service";

const logger = new ConsoleLogger();

// const auth0 = new Auth0Adapter({
//   issuerBaseURL: "https://dev-m3qbhz01kkxn1lxy.us.auth0.com/",
//   audience: "https://oasis.sixyouss.com",
// });
const azad = new AzureADAdapter({
  issuer: `https://login.microsoftonline.com//v2.0`,
  audience: ``,
  jwksUri: `https://login.microsoftonline.com/organizations/discovery/v2.0/keys`,
});

const server = new ExpressServer(logger, azad);
const messageBroker = new MbCbAdapter();
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
