import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../db/prisma";
import { JiraIssueInput } from "../types/jira";
import { openai } from "../utils/openai";

const embeddingModel = "text-embedding-3-small";

export function toSemanticText(issue: JiraIssueInput): string {
  return [
    `Issue ${issue.id}`,
    `Project: ${issue.projectKey}`,
    `Summary: ${issue.summary}`,
    `Description: ${issue.description ?? "N/A"}`,
    `Type: ${issue.issueType}`,
    `Status: ${issue.status}`,
    `Priority: ${issue.priority}`,
    `Assignee: ${issue.assignee ?? "Unassigned"}`
  ].join("\n");
}

function vectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

export async function parseSeedFile(seedPath: string): Promise<JiraIssueInput[]> {
  const absolutePath = path.resolve(process.cwd(), seedPath);
  const raw = await fs.readFile(absolutePath, "utf8");
  const data = JSON.parse(raw) as JiraIssueInput[];
  return data;
}

export async function upsertIssue(issue: JiraIssueInput): Promise<void> {
  const semanticText = toSemanticText(issue);
  const embedding = await openai.embeddings.create({
    model: embeddingModel,
    input: semanticText
  });

  const vector = embedding.data[0].embedding;

  await prisma.jiraIssue.upsert({
    where: { id: issue.id },
    update: {
      projectKey: issue.projectKey,
      summary: issue.summary,
      description: issue.description,
      issueType: issue.issueType,
      status: issue.status,
      priority: issue.priority,
      assignee: issue.assignee,
      reporter: issue.reporter,
      createdAt: new Date(issue.createdAt),
      updatedAt: issue.updatedAt ? new Date(issue.updatedAt) : null,
      resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : null,
      timeEstimate: issue.timeEstimate,
      timeSpent: issue.timeSpent,
      rawJson: issue as object,
      semanticText
    },
    create: {
      id: issue.id,
      projectKey: issue.projectKey,
      summary: issue.summary,
      description: issue.description,
      issueType: issue.issueType,
      status: issue.status,
      priority: issue.priority,
      assignee: issue.assignee,
      reporter: issue.reporter,
      createdAt: new Date(issue.createdAt),
      updatedAt: issue.updatedAt ? new Date(issue.updatedAt) : undefined,
      resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : undefined,
      timeEstimate: issue.timeEstimate,
      timeSpent: issue.timeSpent,
      rawJson: issue as object,
      semanticText
    }
  });

  await prisma.$executeRawUnsafe(
    'UPDATE "JiraIssue" SET embedding = $1::vector WHERE id = $2',
    vectorLiteral(vector),
    issue.id
  );
}

export async function ingestFromSeed(seedPath: string): Promise<{ count: number }> {
  const issues = await parseSeedFile(seedPath);
  for (const issue of issues) {
    await upsertIssue(issue);
  }
  return { count: issues.length };
}
