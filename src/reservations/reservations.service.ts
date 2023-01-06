import { MessageBroker } from "../infrastructure/message-broker/MessageBroker";
import { OPEN_SOCKETS } from "../infrastructure/ws";
import { ReservationsRepository } from "./reservations.repository";

export class ReservationsService {
  constructor(private reservationsRepo: ReservationsRepository, private messageBroker: MessageBroker) {}

  subscribeToNewReservations() {
    this.messageBroker.subscribe("create-reservation", (message) => {
      OPEN_SOCKETS.forEach((socket) => {
        socket.send(message, false, true);
      });
    });
  }

  async getAll() {
    return this.reservationsRepo.getAll();
  }

  async createReservation(startTime: string, endTime: string, rate: string, resourceId: string, customerId: string) {
    const isResourceAvailabale = await this.isResourceAvailable(resourceId, startTime, endTime);

    if (!isResourceAvailabale) {
      throw new Error(`The resource is not available for the requested time period.`);
    }

    const createdReservation = await this.reservationsRepo.insertReservation(
      startTime,
      endTime,
      rate,
      resourceId,
      customerId
    );

    this.messageBroker.send("create-reservation", `new reservation created: id=${createdReservation.id}`);

    return createdReservation;
  }

  async isResourceAvailable(resourceId: string, startTime: string, endTime: string) {
    const reservations = await this.reservationsRepo.getReservationsRange(resourceId, startTime, endTime);
    return reservations.length === 0;
  }
}
