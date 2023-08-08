import { Module } from "@nestjs/common";
import { ReservationModule } from "./reservation/reservation.module";
import { Logger } from "./infrastructure/logger/logger.port";
import { NestFactory } from "@nestjs/core";
import { CommonModule } from "./common.module";

@Module({
  imports: [CommonModule, ReservationModule],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const logger = app.get<Logger>(Logger);

  logger.log(`app listening on ${await app.getUrl()}`);
}

bootstrap();
