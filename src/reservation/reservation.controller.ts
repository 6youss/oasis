import { ControllerResult, HttpContext } from "../infrastructure/http/http.adapter";
import { ReservationService } from "./reservation.service";

export class ReservationController {
  constructor(private reservationsService: ReservationService) {}

  getAll = async () => {
    const reservations = await this.reservationsService.getAll();
    return reservations;
  };

  createReservation = async (httpContext: HttpContext) => {
    const { startTime, endTime, resourceId, customerId } = httpContext.body;
    const reservation = await this.reservationsService.createReservation(startTime, endTime, resourceId, customerId);
    return new ControllerResult(201, reservation);
  };
}
