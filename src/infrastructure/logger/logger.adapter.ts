import { HttpContext } from "../http/http.adapter";

type LogLevels = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export interface LogDTO {
  description: string;
  body: string;
  severity: LogLevels;
  http?: HttpContext;
}

export type LogId = string;

export type LogTimeStamp = Date;

export interface LogResult {
  id: LogId;
  date: LogTimeStamp;
  data: LogDTO;
}

export type LogCb = (log: LogResult) => void;

export interface Logger {
  log(log: LogDTO): LogResult | Promise<LogResult>;
}
