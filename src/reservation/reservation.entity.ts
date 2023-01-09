interface ReservationFields {
  id: number;
  start_time: Date;
  end_time: Date;
  resource_id: number;
  customer_id: number;
}

export class Reservation implements ReservationFields {
  id: number;
  start_time: Date;
  end_time: Date;
  resource_id: number;
  customer_id: number;

  constructor(value: ReservationFields) {
    this.id = value.id;
    this.start_time = value.start_time;
    this.end_time = value.end_time;
    this.resource_id = value.resource_id;
    this.customer_id = value.customer_id;
  }
}
