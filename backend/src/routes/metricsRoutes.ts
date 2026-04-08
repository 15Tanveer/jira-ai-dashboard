import { Router } from "express";
import {
  overburnController,
  projectHealthController,
  sentimentController,
  utilizationController
} from "../controllers/metricsController";

export const metricsRouter = Router();

metricsRouter.get("/project-health", projectHealthController);
metricsRouter.get("/overburn", overburnController);
metricsRouter.get("/utilization", utilizationController);
metricsRouter.get("/sentiment", sentimentController);
