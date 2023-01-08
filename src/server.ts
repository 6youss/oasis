import express from "express";
import { MbCbImplementation } from "./infrastructure/message-broker/cb.port";
import { MessageBroker } from "./infrastructure/message-broker/message-broker.adapter";
import { wsApp } from "./infrastructure/ws";
import { ReservationsController } from "./reservations/reservations.controller";
import { ReservationsRepository } from "./reservations/reservations.repository";
import { ReservationsService } from "./reservations/reservations.service";

const app = express();

const mbImplementation = new MbCbImplementation();
const messageBroker = new MessageBroker(mbImplementation);

const reservationsRepository = new ReservationsRepository();
const reservationsService = new ReservationsService(reservationsRepository, messageBroker);
reservationsService.subscribeToNewReservations();
const reservationsController = new ReservationsController(reservationsService);

app.use("/reservations", reservationsController.router);

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
