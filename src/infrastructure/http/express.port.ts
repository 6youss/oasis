import { Request, Response } from "express";
import { ControllerFn, HttpContext } from "./http.adapter";

export const makeExpressAdapter = (controller: ControllerFn) => async (req: Request, res: Response) => {
  const httpContext = new HttpContext(req.body, req.query, req.params, req.ip, req.method, req.path, req, res);
  try {
    const controllerReturn = await controller(httpContext);
    res.set("Content-Type", "application/json");
    res.type("json");
    const envolop = httpContext.createRESTEnvelope(controllerReturn);
    res.status(envolop.statusCode).send(envolop);
  } catch (e) {
    console.error(e);
    const errEnvelop = httpContext.createRESTErrorEnvelope(e);
    res.status(errEnvelop.statusCode).json(errEnvelop);
  }
};
