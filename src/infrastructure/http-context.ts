import { Request, Response } from "express";

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
}
