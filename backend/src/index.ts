import "express-async-errors";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { apiRouter } from "./routes";
import { logger } from "./utils/logger";
import { redis } from "./db/redis";

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", apiRouter);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error(err);
    res.status(500).json({ error: err.message });
  });

  await redis.connect();
  app.listen(env.PORT, () => logger.info(`Backend running on http://localhost:${env.PORT}`));
}

bootstrap().catch((err) => {
  logger.error("Failed bootstrap", err);
  process.exit(1);
});
