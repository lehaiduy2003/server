import express, { Router } from "express";
export default abstract class BaseRouter {
  protected router: Router;
  constructor() {
    this.router = express.Router();
    this.init();
  }

  public getRouter(): Router {
    return this.router;
  }

  public abstract init(): void;
}
