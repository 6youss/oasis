import { Logger } from "./logger.adapter";

export class ConsoleLogger implements Logger {
  constructor() {}

  log(message: string, metadata?: any): void {
    console.log(`[LOG] ${message}`, metadata || "");
  }

  error(message: string, metadata?: any): void {
    console.error(`[ERROR] ${message}`, metadata || "");
  }

  warn(message: string, metadata?: any): void {
    console.warn(`[WARN] ${message}`, metadata || "");
  }

  debug(message: string, metadata?: any): void {
    console.debug(`[DEBUG] ${message}`, metadata || "");
  }
}
