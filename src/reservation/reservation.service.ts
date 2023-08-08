import { ConflictError } from "../infrastructure/http/http-errors";
import { Logger } from "../infrastructure/logger/logger.port";
import { MessageBroker } from "../infrastructure/message-broker/message-broker.port";
import { OPEN_SOCKETS } from "../infrastructure/ws";
import { ReservationRepository } from "./reservation.repository";

export class ReservationService {
  constructor(
    private reservationsRepo: ReservationRepository,
    private messageBroker: MessageBroker,
    private logger: Logger
  ) {}

  subscribeToNewReservations() {
    this.messageBroker.subscribe("create-reservation", (message) => {
      OPEN_SOCKETS.forEach((socket) => {
        socket.send(message, false, true);
      });
    });
  }

  async getAll() {
    this.logger.log("getting all the reservations");
    return this.reservationsRepo.getAll();
  }

  async createReservation(startTime: string, endTime: string, resourceId: string, customerId: string) {
    const isResourceAvailabale = await this.isResourceAvailable(resourceId, startTime, endTime);

    if (!isResourceAvailabale) {
      throw new ConflictError(`The resource is not available for the requested time period.`);
    }

    const createdReservation = await this.reservationsRepo.insertReservation(
      startTime,
      endTime,
      resourceId,
      customerId
    );

    this.messageBroker.send("create-reservation", `new reservation created: id=${createdReservation.id}`);

    return createdReservation;
  }

  /**
   * Check if the resource is available for the requested time period
   */
  async isResourceAvailable(resourceId: string, startTime: string, endTime: string) {
    const reservations = await this.reservationsRepo.getReservationsRange(resourceId, startTime, endTime);
    return reservations.length === 0;
  }
}
