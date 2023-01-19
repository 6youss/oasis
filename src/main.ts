import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { ExpressServer } from "./infrastructure/http/express.port";
import { Console } from "./infrastructure/logger/console.port";
import { MbCbImplementation } from "./infrastructure/message-broker/cb.port";
import { wsApp } from "./infrastructure/ws";
import { registerReservationRoutes } from "./reservation/reservation.routes";

const server = new ExpressServer();

const messageBroker = new MbCbImplementation();
const postgresAdapter = new PostgresAdapter();
const logger = new Console();
postgresAdapter.init();

registerReservationRoutes(server, postgresAdapter, messageBroker, logger);

// start http server
const httpPort = 3000;
server.start(httpPort).then(() => {
  console.log(`Server listening at http://localhost:${httpPort}`);
});

// start websocket server
const wsPort = 9001;
wsApp.listen(wsPort, (listenSocket) => {
  if (listenSocket) {
    console.log(`Websocket server listening to port ${wsPort}`);
  }
});
