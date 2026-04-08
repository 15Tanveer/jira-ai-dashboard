import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  JIRA_SEED_PATH: z.string().default("./src/data/jira-seed.json"),
  OVERBURNT_DAYS_THRESHOLD: z.coerce.number().default(3)
});

export const env = envSchema.parse(process.env);
