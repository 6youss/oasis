export type LogAdditionalData = {
  [key: string]: any;
};

export type LogId = string;

export type LogTimeStamp = Date;

export interface LogMetadata {
  id: LogId;
  date: LogTimeStamp;
}

export interface LogResult {
  metadata: LogMetadata;
  description: string;
  additionalData?: LogAdditionalData;
}

export type DebugLogResult = LogResult & { logLevel: "DEBUG" };
export type InfoLogResult = LogResult & { logLevel: "INFO" };
export type WarningLogResult = LogResult & { logLevel: "WARNING" };
export type ErrorLogResult = LogResult & { logLevel: "ERROR"; error: Error };

export interface Logger {
  debug(description: string, additionalData?: LogAdditionalData): DebugLogResult | Promise<DebugLogResult>;
  info(description: string, additionalData?: LogAdditionalData): InfoLogResult | Promise<InfoLogResult>;
  warn(description: string, additionalData?: LogAdditionalData): WarningLogResult | Promise<WarningLogResult>;
  error(description: string, error: Error, additionalData?: LogAdditionalData): ErrorLogResult | Promise<ErrorLogResult>;
}
