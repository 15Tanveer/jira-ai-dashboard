import { prisma } from "../db/prisma";

const doneStatuses = new Set(["done", "closed", "resolved"]);
const backlogStatuses = new Set(["backlog", "to do", "open"]);
const inProgressStatuses = new Set(["in progress", "blocked", "review"]);

export async function getProjectHealth() {
  const issues = await prisma.jiraIssue.findMany();
  const total = issues.length || 1;

  const completed = issues.filter((i) => doneStatuses.has(i.status.toLowerCase())).length;
  const backlog = issues.filter((i) => backlogStatuses.has(i.status.toLowerCase())).length;
  const highCritical = issues.filter((i) => ["high", "critical", "highest"].includes(i.priority.toLowerCase())).length;
  const bugs = issues.filter((i) => i.issueType.toLowerCase() === "bug");
  const unresolvedBugs = bugs.filter((i) => !doneStatuses.has(i.status.toLowerCase())).length;

  const createdByWeek = issues.length;
  const resolvedByWeek = issues.filter((i) => i.resolvedAt).length;
  const velocity = createdByWeek === 0 ? 0 : resolvedByWeek / createdByWeek;

  const riskScore =
    (backlog / total) * 0.25 +
    (highCritical / total) * 0.3 +
    (bugs.length ? unresolvedBugs / bugs.length : 0) * 0.3 +
    (velocity < 0.6 ? 0.15 : 0);

  let health: "Healthy" | "Moderate" | "At Risk" = "Healthy";
  if (riskScore > 0.55) health = "At Risk";
  else if (riskScore > 0.35) health = "Moderate";

  return {
    health,
    metrics: {
      backlogPct: (backlog / total) * 100,
      completedPct: (completed / total) * 100,
      highCriticalPct: (highCritical / total) * 100,
      unresolvedBugRatio: bugs.length ? unresolvedBugs / bugs.length : 0,
      velocity
    },
    statusBuckets: {
      backlog,
      inProgress: issues.filter((i) => inProgressStatuses.has(i.status.toLowerCase())).length,
      completed
    }
  };
}
