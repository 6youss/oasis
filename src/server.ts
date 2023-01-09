import express from "express";
import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { makeExpressAdapter } from "./infrastructure/http/express.port";
import { MbCbImplementation } from "./infrastructure/message-broker/cb.port";
import { MessageBroker } from "./infrastructure/message-broker/message-broker.adapter";
import { wsApp } from "./infrastructure/ws";
import { ReservationController } from "./reservation/reservation.controller";
import { ReservationRepository } from "./reservation/reservation.repository";
import { ReservationService } from "./reservation/reservation.service";

const app = express();

const mbCbImplementation = new MbCbImplementation();
const messageBroker = new MessageBroker(mbCbImplementation);

const postgresAdapter = new PostgresAdapter();
postgresAdapter.init();

const reservationsRepository = new ReservationRepository(postgresAdapter);
const reservationsService = new ReservationService(reservationsRepository, messageBroker);
reservationsService.subscribeToNewReservations();
const reservationsController = new ReservationController(reservationsService);

const reservationsRouter = express.Router();
reservationsRouter.get("/", makeExpressAdapter(reservationsController.getAll));
reservationsRouter.post("/", makeExpressAdapter(reservationsController.createReservation));

app.use("/reservations", reservationsRouter);

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
