import { LogDTO, LogCb, Logger, LogResult } from "./logger.adapter";

export class Console implements Logger {
  private logId: string;

  private static NEXT_ID: number = 0;
  constructor() {
    this.logId = this.createLogId();
  }

  private static getNextId(): void {
    Console.NEXT_ID++;
  }

  private createLogId(): string {
    const logId = Console.NEXT_ID;
    Console.getNextId();
    return logId.toString();
  }

  log(log: LogDTO) {
    const logResult: LogResult = {
      id: this.logId,
      date: new Date(),
      data: log,
    };
    return logResult;
  }
}
