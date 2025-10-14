import { Router } from "express";
import apiRouter from "./api.router.js";
import viewsRouter from "./views.router.js";

const indexRouter = Router();

indexRouter.use("/api", apiRouter);
indexRouter.use("/", viewsRouter);

export default indexRouter;
