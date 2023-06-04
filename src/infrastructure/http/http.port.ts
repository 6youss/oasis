import { HttpError } from "./http-errors";

export interface HttpServer {
  start: (port: number) => Promise<void>;
  registerRoute: (route: Route) => void;
}

export interface Route {
  method: "get" | "post" | "delete" | "put";
  path: string;
  /**
   * true by default
   */
  private?: boolean;
  controller: ControllerFn;
}
export class ControllerResult {
  constructor(public statusCode: number, public data: any) {}
}

export type ControllerFn = (httpCtx: HttpContext) => Promise<any>;

export class HttpContext {
  constructor(
    public body: any,
    public query: any,
    public params: Record<string, string>,
    public ip: string,
    public method: string,
    public path: string
  ) {}

  createRESTSuccessEnvelope(returnResult: unknown) {
    let envelop = {
      success: true,
      statusCode: 200,
      data: returnResult,
    };
    if (returnResult instanceof ControllerResult) {
      envelop = {
        success: true,
        statusCode: returnResult.statusCode,
        data: returnResult.data,
      };
    }
    return envelop;
  }

  createRESTErrorEnvelope(error: unknown) {
    let errEnvelop = {
      success: false,
      statusCode: 500,
      error: {
        description: "Internal server error",
      },
    };
    if (error instanceof HttpError) {
      errEnvelop = {
        success: false,
        statusCode: error.statusCode,
        error: {
          description: error.message,
        },
      };
    }
    return errEnvelop;
  }
}
