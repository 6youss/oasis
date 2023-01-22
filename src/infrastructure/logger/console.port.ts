import { Logger, LogResult, LogAdditionalData } from "./logger.adapter";

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

  debug(description: string, additionalData?: LogAdditionalData) {
    const logResult: LogResult & { logLevel: "DEBUG" } = {
      metadata: {
        id: this.logId,
        date: new Date(),
      },
      description,
      additionalData,
      logLevel: "DEBUG",
    };
    console.debug(logResult, additionalData);
    return logResult;
  }

  info(description: string, additionalData?: LogAdditionalData) {
    const logResult: LogResult & { logLevel: "INFO" } = {
      metadata: {
        id: this.logId,
        date: new Date(),
      },
      description,
      additionalData,
      logLevel: "INFO",
    };
    console.info(logResult, additionalData);
    return logResult;
  }

  warn(description: string, additionalData?: LogAdditionalData) {
    const logResult: LogResult & { logLevel: "WARNING" } = {
      metadata: {
        id: this.logId,
        date: new Date(),
      },
      description,
      additionalData,
      logLevel: "WARNING",
    };
    console.warn(logResult, additionalData);
    return logResult;
  }

  error(description: string, error: Error, additionalData?: LogAdditionalData) {
    const logResult: LogResult & { logLevel: "ERROR"; error: Error } = {
      metadata: {
        id: this.logId,
        date: new Date(),
      },
      description,
      additionalData,
      logLevel: "ERROR",
      error,
    };
    console.error(logResult, error, additionalData);
    return logResult;
  }
}
