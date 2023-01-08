import { ControllerFn } from "../infrastructure/express.adapter";
import { HttpContext } from "../infrastructure/http-context";
import { ReservationsService } from "./reservations.service";

export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  getAll: ControllerFn = async () => {
    const reservations = await this.reservationsService.getAll();
    return reservations;
  };

  createReservation = async (httpContext: HttpContext) => {
    const { startTime, endTime, resourceId, customerId } = httpContext.body;
    const reservation = await this.reservationsService.createReservation(startTime, endTime, resourceId, customerId);
    return reservation;
  };
}
