import { Body, Controller, Get, Injectable } from "@nestjs/common";
import { ReservationService } from "./reservation.service";

@Controller()
export class ReservationController {
  constructor(private reservationsService: ReservationService) {}

  @Get()
  async getAll() {
    const reservations = await this.reservationsService.getAll();
    return reservations;
  }

  @Get()
  async createReservation(@Body() body: any) {
    const { startTime, endTime, resourceId, customerId } = body;
    const reservation = await this.reservationsService.createReservation(startTime, endTime, resourceId, customerId);
    return reservation;
  }
}
