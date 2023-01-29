import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { ExpressServer } from "./infrastructure/http/express.port";
import { Console } from "./infrastructure/logger/console.port";
import { MbCbImplementation } from "./infrastructure/message-broker/cb.port";
import { wsApp } from "./infrastructure/ws";
import { registerReservationRoutes } from "./reservation/reservation.routes";

const server = new ExpressServer();
const logger = new Console();
const messageBroker = new MbCbImplementation();
const postgresAdapter = new PostgresAdapter(logger);
postgresAdapter.init();

registerReservationRoutes(server, postgresAdapter, messageBroker, logger);

// start http server
const httpPort = 3000;
server.start(httpPort).then(() => {
  logger.info(`Server listening at http://localhost:${httpPort}`);
});

// start websocket server
const wsPort = 9001;
wsApp.listen(wsPort, (listenSocket) => {
  if (listenSocket) {
    logger.info(`Websocket server listening to port ${wsPort}`);
  }
});
