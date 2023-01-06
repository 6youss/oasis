import express from "express";
import { pool } from "./infrastructure/db";
import { MbCbImplementation } from "./infrastructure/message-broker/CbImplementation";
import { MessageBroker } from "./infrastructure/message-broker/MessageBroker";
import { wsApp } from "./infrastructure/ws";
import { ReservationsController } from "./reservations/reservations.controller";
import { ReservationsRepository } from "./reservations/reservations.repository";
import { ReservationsService } from "./reservations/reservations.service";
import { ResourcesController } from "./resources/resources.controller";
import { ResourcesRepository } from "./resources/resources.repository";
import { ResourcesService } from "./resources/resources.service";

const app = express();

const mbImplementation = new MbCbImplementation();
const messageBroker = new MessageBroker(mbImplementation);

const reservationsRepository = new ReservationsRepository();
const reservationsService = new ReservationsService(reservationsRepository, messageBroker);
reservationsService.subscribeToNewReservations();
const reservationsController = new ReservationsController(reservationsService);

app.use("/reservations", reservationsController.router);

const resourcesRepository = new ResourcesRepository();
const resourcesService = new ResourcesService(resourcesRepository);
const resourcesController = new ResourcesController(resourcesService);

app.use("/resources", resourcesController.router);

// start db server
pool.connect();

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
