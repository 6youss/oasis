import express from "express";
import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { MbCbImplementation } from "./infrastructure/message-broker/cb.port";
import { MessageBroker } from "./infrastructure/message-broker/message-broker.adapter";
import { wsApp } from "./infrastructure/ws";
import { getReservationRoutes } from "./reservation/reservation.routes";
import { swaggerRoute } from "./swagger-route";

const app = express();

const mbCbImplementation = new MbCbImplementation();
const messageBroker = new MessageBroker(mbCbImplementation);

const postgresAdapter = new PostgresAdapter();
postgresAdapter.init();

app.use("/api/docs", swaggerRoute);

app.use("/api/reservations", getReservationRoutes(postgresAdapter, messageBroker));

// start http server
const httpPort = 3000;
app.listen(httpPort, () => {
  console.log(`Server listening at http://localhost:${httpPort}`);
});

// start websocket server
const wsPort = 9001;
wsApp.listen(wsPort, (listenSocket) => {
  if (listenSocket) {
    console.log(`Websocket server listening to port ${wsPort}`);
  }
});
