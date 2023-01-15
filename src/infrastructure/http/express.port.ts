import { Request, Response } from "express";
import express from "express";
import { ControllerFn, HttpContext, HttpServer, Route, SwaggerOpts } from "./http.adapter";
import { Router as SwaggerRouter } from "express";

export const makeExpressAdapter = (controller: ControllerFn) => async (req: Request, res: Response) => {
  console.log("got here");
  const httpContext = new HttpContext(req.body, req.query, req.params, req.ip, req.method, req.path);
  try {
    const controllerResult = await controller(httpContext);
    res.set("Content-Type", "application/json");
    res.type("json");
    const envolop = httpContext.createRESTSuccessEnvelope(controllerResult);
    res.status(envolop.statusCode).send(envolop);
  } catch (e) {
    console.error(e);
    const errEnvelop = httpContext.createRESTErrorEnvelope(e);
    res.status(errEnvelop.statusCode).json(errEnvelop);
  }
};

export class ExpressServer implements HttpServer {
  app = express();

  start(port: number) {
    return new Promise<void>((resolve) => {
      this.app.listen(port, () => {
        resolve();
      });
    });
  }

  registerRoute = (route: Route) => {
    this.app[route.method](route.path, makeExpressAdapter(route.controller));
  };
}
