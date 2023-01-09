import { Request, Response } from "express";
import { HttpError } from "./http-errors";

export type ControllerReturnType = { statusCode: number; data: any };

export type ControllerFn = (httpReq: HttpContext) => Promise<any>;

export class HttpContext {
  constructor(
    public body: any,
    public query: any,
    public params: Record<string, string>,
    public ip: string,
    public method: string,
    public path: string,
    private expressReq: Request,
    private expressRes: Response
  ) {}

  getExpressReq(): Request {
    return this.expressReq;
  }
  getExpressRes(): Response {
    return this.expressRes;
  }

  createRESTEnvelop(returnResult: unknown) {
    let envelop = {
      success: true,
      statusCode: 200,
      data: returnResult,
    };
    if (isControllerReturnType(returnResult)) {
      envelop = {
        success: true,
        statusCode: returnResult.statusCode,
        data: returnResult.data,
      };
    }
    return envelop;
  }

  createRESTErrorEnvelop(error: unknown) {
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

function isControllerReturnType(o: unknown): o is ControllerReturnType {
  if (o && typeof o === "object" && "type" in o && "data" in o) {
    return true;
  }
  return false;
}
