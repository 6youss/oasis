import { Global, Module } from "@nestjs/common";
import { PostgresAdapter } from "./infrastructure/db/postgres.adapter";
import { ConsoleLogger } from "./infrastructure/logger/console.adapter";
import { MessageBroker } from "./infrastructure/message-broker/message-broker.port";
import { MbCbAdapter } from "./infrastructure/message-broker/cb.adapter";
import { Logger } from "./infrastructure/logger/logger.port";

const logger = new ConsoleLogger();
const db = new PostgresAdapter(logger);
const mb = new MbCbAdapter();

@Global()
@Module({
  providers: [
    {
      provide: PostgresAdapter,
      useFactory: async () => {
        await db.init();
        return db;
      },
    },
    {
      provide: Logger,
      useValue: logger,
    },
    {
      provide: MessageBroker,
      useValue: mb,
    },
  ],
  exports: [PostgresAdapter, MessageBroker, Logger],
})
export class CommonModule {}
