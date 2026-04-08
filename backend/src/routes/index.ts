import { Router } from "express";
import { metricsRouter } from "./metricsRoutes";
import { chatRouter } from "./chatRoutes";

export const apiRouter = Router();

apiRouter.use("/metrics", metricsRouter);
apiRouter.use("/chat", chatRouter);
