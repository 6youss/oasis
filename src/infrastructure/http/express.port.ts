import express, { Request, Response } from "express";
import { Logger } from "../logger/logger.adapter";
import { ControllerFn, HttpContext, HttpServer, Route } from "./http.adapter";

export class ExpressServer implements HttpServer {
  app = express();

  constructor(private logger: Logger) {}

  start(port: number) {
    return new Promise<void>((resolve) => {
      this.app.listen(port, () => {
        resolve();
      });
    });
  }

  registerRoute = (route: Route) => {
    this.app[route.method](route.path, this.createExpressAdapter(route.controller));
  };

  createExpressAdapter = (controller: ControllerFn) => async (req: Request, res: Response) => {
    const httpContext = new HttpContext(req.body, req.query, req.params, req.ip, req.method, req.path);
    try {
      const controllerResult = await controller(httpContext);
      res.set("Content-Type", "application/json");
      res.type("json");
      const envolop = httpContext.createRESTSuccessEnvelope(controllerResult);
      res.status(envolop.statusCode).send(envolop);
    } catch (e) {
      this.logger.error("[HTTP RESPONSE]", e);
      const errEnvelop = httpContext.createRESTErrorEnvelope(e);
      res.status(errEnvelop.statusCode).json(errEnvelop);
    }
  };
}
