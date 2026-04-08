import { env } from "../config/env";
import { ingestFromSeed } from "../services/ingestionService";
import { logger } from "../utils/logger";

async function run() {
  const result = await ingestFromSeed(env.JIRA_SEED_PATH);
  logger.info(`Seeded ${result.count} issues from ${env.JIRA_SEED_PATH}`);
}

run().catch((err) => {
  logger.error(err);
  process.exit(1);
});
