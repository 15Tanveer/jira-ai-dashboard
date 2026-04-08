import { env } from "../config/env";
import { prisma } from "../db/prisma";

const doneStatuses = new Set(["done", "closed", "resolved"]);

export async function getOverburnItems() {
  const issues = await prisma.jiraIssue.findMany();
  const now = Date.now();

  return issues.filter((issue) => {
    const overSpent = Boolean(issue.timeEstimate && issue.timeSpent && issue.timeSpent > issue.timeEstimate);
    const unresolvedDays = (now - issue.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const unresolvedTooLong =
      !doneStatuses.has(issue.status.toLowerCase()) && unresolvedDays >= env.OVERBURNT_DAYS_THRESHOLD;
    return overSpent || unresolvedTooLong;
  });
}
