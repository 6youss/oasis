import { NextFunction, Request, Response, Router } from "express";
import { ReservationsService } from "./reservations.service";

export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  get router() {
    const router = Router();
    router.get("/", this.getAll);
    router.post("/", this.createReservation);
    return router;
  }

  getAll = async (_: Request, res: Response, __: NextFunction) => {
    const reservations = await this.reservationsService.getAll();
    res.json(reservations);
  };

  createReservation = async (req: Request, res: Response, __: NextFunction) => {
    const { startTime, endTime, rate, resourceId, customerId } = req.body;
    const reservation = await this.reservationsService.createReservation(
      startTime,
      endTime,
      rate,
      resourceId,
      customerId
    );
    res.json(reservation);
  };
}
