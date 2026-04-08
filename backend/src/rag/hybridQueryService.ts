import { prisma } from "../db/prisma";
import { openai } from "../utils/openai";
import { detectIntent } from "./intentDetector";

function vectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

function extractFilters(query: string): { assignee?: string; status?: string; issueType?: string } {
  const lower = query.toLowerCase();
  const filters: { assignee?: string; status?: string; issueType?: string } = {};
  if (lower.includes("backlog")) filters.status = "Backlog";
  if (lower.includes("bug")) filters.issueType = "Bug";

  const possessive = query.match(/([A-Za-z]+)'s/);
  if (possessive) filters.assignee = possessive[1];
  return filters;
}

export async function hybridSearch(query: string) {
  const intent = detectIntent(query);
  const filters = extractFilters(query);

  const structuredResults =
    intent !== "semantic"
      ? await prisma.jiraIssue.findMany({
          where: {
            assignee: filters.assignee ? { contains: filters.assignee, mode: "insensitive" } : undefined,
            status: filters.status ? { equals: filters.status, mode: "insensitive" } : undefined,
            issueType: filters.issueType ? { equals: filters.issueType, mode: "insensitive" } : undefined
          },
          take: 10,
          orderBy: { createdAt: "desc" }
        })
      : [];

  let semanticResults: any[] = [];
  if (intent !== "structured") {
    const embedding = await openai.embeddings.create({ model: "text-embedding-3-small", input: query });
    const vector = vectorLiteral(embedding.data[0].embedding);
    semanticResults = await prisma.$queryRawUnsafe(
      `SELECT id, summary, status, priority, assignee, "issueType"
       FROM "JiraIssue"
       ORDER BY embedding <=> $1::vector
       LIMIT 8`,
      vector
    );
  }

  const resultMap = new Map<string, any>();
  [...structuredResults, ...semanticResults].forEach((row: any) => {
    resultMap.set(row.id, row);
  });

  return { intent, filters, issues: Array.from(resultMap.values()).slice(0, 12) };
}
