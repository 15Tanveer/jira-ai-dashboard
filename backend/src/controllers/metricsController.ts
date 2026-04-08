import { Request, Response } from "express";
import { getProjectHealth } from "../analytics/projectHealthService";
import { getOverburnItems } from "../analytics/overburnService";
import { getResourceUtilization } from "../analytics/utilizationService";
import { getSentimentAnalysis } from "../analytics/sentimentService";
import { getOrSetCache } from "../services/cacheService";

export async function projectHealthController(_req: Request, res: Response) {
  const data = await getOrSetCache("metrics:project-health", 60, getProjectHealth);
  res.json(data);
}

export async function overburnController(_req: Request, res: Response) {
  const data = await getOrSetCache("metrics:overburn", 60, getOverburnItems);
  res.json({ items: data });
}

export async function utilizationController(_req: Request, res: Response) {
  const data = await getOrSetCache("metrics:utilization", 60, getResourceUtilization);
  res.json({ assignees: data });
}

export async function sentimentController(_req: Request, res: Response) {
  const data = await getOrSetCache("metrics:sentiment", 120, getSentimentAnalysis);
  res.json(data);
}
