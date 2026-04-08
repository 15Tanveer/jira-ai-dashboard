import { prisma } from "../db/prisma";

const doneStatuses = new Set(["done", "closed", "resolved"]);
const inProgressStatuses = new Set(["in progress", "blocked", "review"]);

export async function getResourceUtilization() {
  const issues = await prisma.jiraIssue.findMany();
  const byAssignee = new Map<string, typeof issues>();

  for (const issue of issues) {
    const key = issue.assignee ?? "Unassigned";
    if (!byAssignee.has(key)) byAssignee.set(key, []);
    byAssignee.get(key)!.push(issue);
  }

  const avg = issues.length / Math.max(byAssignee.size, 1);

  return Array.from(byAssignee.entries()).map(([assignee, items]) => {
    const totalAssigned = items.length;
    const completed = items.filter((i) => doneStatuses.has(i.status.toLowerCase())).length;
    const inProgress = items.filter((i) => inProgressStatuses.has(i.status.toLowerCase())).length;
    const distribution = issues.length ? totalAssigned / issues.length : 0;

    let utilization: "Over-utilized" | "Under-utilized" | "Balanced" = "Balanced";
    if (totalAssigned > avg * 1.35) utilization = "Over-utilized";
    else if (totalAssigned < avg * 0.65) utilization = "Under-utilized";

    return { assignee, totalAssigned, completed, inProgress, workloadDistribution: distribution, utilization };
  });
}
