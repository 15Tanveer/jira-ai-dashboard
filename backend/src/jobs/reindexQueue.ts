import { Queue, Worker } from "bullmq";
import { env } from "../config/env";
import { ingestFromSeed } from "../services/ingestionService";

const connection = { url: env.REDIS_URL };
export const reindexQueue = new Queue("jira-reindex", { connection });

export const reindexWorker = new Worker(
  "jira-reindex",
  async () => {
    await ingestFromSeed(env.JIRA_SEED_PATH);
  },
  { connection }
);
