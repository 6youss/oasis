import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { ExpressServer } from "./infrastructure/http/express.port";
import { ConsoleLogger } from "./infrastructure/logger/console.port";
import { MbCbImplementation } from "./infrastructure/message-broker/cb.port";
import { wsApp } from "./infrastructure/ws";
import { registerReservationRoutes } from "./reservation/reservation.routes";

const logger = new ConsoleLogger();
const server = new ExpressServer(logger);
const messageBroker = new MbCbImplementation();
const postgresAdapter = new PostgresAdapter(logger);
postgresAdapter.init();

registerReservationRoutes(server, postgresAdapter, messageBroker, logger);

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
