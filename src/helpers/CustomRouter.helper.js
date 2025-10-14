import { Router } from "express";
import setResponses from "../middlewares/setResponses.mid.js";
import setupPolicies from "../middlewares/setPolicies.mid.js";

class CustomRouter {
  constructor() {
    this.router = Router();
    this.use(setResponses);
  }
  getRouter = () => this.router;
  setMiddlewares = (middlewares) =>
    middlewares.map((each) => async (req, res, next) => {
      try {
        await each(req, res, next);
      } catch (error) {
        next(error);
      }
    });
  create = (path, policies, ...midds) =>
    this.router.post(path, setupPolicies(policies), this.setMiddlewares(midds));
  read = (path, policies, ...midds) =>
    this.router.get(path, setupPolicies(policies), this.setMiddlewares(midds));
  update = (path, policies, ...midds) =>
    this.router.put(path, setupPolicies(policies), this.setMiddlewares(midds));
  destroy = (path, policies, ...midds) =>
    this.router.delete(
      path,
      setupPolicies(policies),
      this.setMiddlewares(midds)
    );
  use = (path, ...midds) => this.router.use(path, this.setMiddlewares(midds));
  patch = (path, policies, ...midds) =>
    this.router.patch(
      path,
      setupPolicies(policies),
      this.setMiddlewares(midds)
    );
}

export default CustomRouter;
