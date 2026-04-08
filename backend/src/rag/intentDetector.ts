import { QueryIntent } from "../types/jira";

const structuredKeywords = ["assignee", "status", "priority", "backlog", "completed", "overloaded", "who"];
const semanticKeywords = ["why", "explain", "insight", "risk", "summary", "related"];

export function detectIntent(query: string): QueryIntent {
  const q = query.toLowerCase();
  const structured = structuredKeywords.some((k) => q.includes(k));
  const semantic = semanticKeywords.some((k) => q.includes(k));
  if (structured && semantic) return "hybrid";
  if (structured) return "structured";
  return "semantic";
}
