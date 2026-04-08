export type JiraIssueInput = {
  id: string;
  key?: string;
  projectKey: string;
  summary: string;
  description?: string;
  issueType: string;
  status: string;
  priority: string;
  assignee?: string;
  reporter?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  timeEstimate?: number;
  timeSpent?: number;
  [key: string]: unknown;
};

export type QueryIntent = "structured" | "semantic" | "hybrid";
