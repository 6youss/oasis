import { Request, Response } from "express";
import { HttpContext } from "./http-context";

type HttpReturnTypes = "1" | "2" | "3";

type ControllerReturnType = { type: HttpReturnTypes; data: any };

export type ControllerFn = (httpReq: HttpContext) => Promise<any>;

export const makeExpressAdapter = (controller: ControllerFn) => async (req: Request, res: Response) => {
  const httpContext = new HttpContext(req.body, req.query, req.params, req.ip, req.method, req.path, req, res);

  try {
    const controllerReturn = await controller(httpContext);
    res.set("Content-Type", "application/json");
    res.type("json");
    const envolop = createRESTEnvolope(controllerReturn);

    res.status(envolop.code).send(envolop);
  } catch (e) {
    res.status(400).send({
      success: false,
      code: 400,
      error: {
        description: e.message,
      },
    });
  }
};

function isControllerReturnType(o: unknown): o is ControllerReturnType {
  if (o && typeof o === "object" && "type" in o && "data" in o) {
    return true;
  }
  return false;
}

function createRESTEnvolope(returnResult: unknown) {
  if (isControllerReturnType(returnResult)) {
  }

  const body = {
    success: true,
    code: 200,
    data: returnResult,
  };
  return body;
}

class HttpError {}

class HttpNotFoundError {}

function createRESTErrorEnvolop(error: unknown) {
  return {
    success: false,
    code: 400,
    error: {
      description: e.message,
    },
  };
}
