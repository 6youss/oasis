import { NextFunction, Request, Response, Router } from "express";
import { ResourcesService } from "./resources.service";

export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  get router() {
    const router = Router();
    router.get("/", this.getAll);
    return router;
  }

  getAll = async (_: Request, res: Response, __: NextFunction) => {
    const resources = await this.resourcesService.getAll();
    res.json(resources);
  };
}
