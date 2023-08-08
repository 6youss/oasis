import express, { Request, Response } from "express";
import { OAuth } from "../auth/auth.port";
import { Logger } from "../logger/logger.port";
import { UnauthorizedError } from "./http-errors";
import { HttpContext, HttpServer, Route } from "./http.port";

export class ExpressServer implements HttpServer {
  app = express();

  constructor(private logger: Logger, private oauth: OAuth) {}

  start(port: number) {
    return new Promise<void>((resolve) => {
      this.app.listen(port, () => {
        resolve();
      });
    });
  }

  registerRoute = (route: Route) => {
    this.app[route.method](route.path, this.createExpressAdapter(route));
  };

  createExpressAdapter = (route: Route) => async (req: Request, res: Response) => {
    const httpContext = new HttpContext(req.body, req.query, req.params, req.ip, req.method, req.path);
    try {
      if (route.private ?? true) {
        await this.validateJwt(req);
      }
      const controllerResult = await route.controller(httpContext);
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

  async validateJwt(req: Request) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError();
    }
    const isTokenValid = await this.oauth.verifyToken(token);
    if (!isTokenValid) {
      throw new UnauthorizedError();
    }
  }
}
