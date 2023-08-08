import { Module } from "@nestjs/common";
import { ReservationController } from "./reservation.controller";
import { ReservationService } from "./reservation.service";
import { PostgresReservationRepository, ReservationRepository } from "./reservation.repository";
import { PostgresAdapter } from "../infrastructure/db/postgres.adapter";
import { Logger } from "../infrastructure/logger/logger.port";
import { MessageBroker } from "../infrastructure/message-broker/message-broker.port";

@Module({
  controllers: [ReservationController],
  providers: [
    {
      provide: ReservationRepository,
      useFactory: (pg) => {
        return new PostgresReservationRepository(pg);
      },
      inject: [PostgresAdapter],
    },
    {
      provide: ReservationService,
      useFactory(logger, mb, repo) {
        return new ReservationService(repo, mb, logger);
      },
      inject: [ReservationRepository, MessageBroker, Logger],
    },
  ],
})
export class ReservationModule {}
