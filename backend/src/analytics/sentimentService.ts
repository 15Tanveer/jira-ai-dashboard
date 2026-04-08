import { prisma } from "../db/prisma";
import { openai } from "../utils/openai";

export async function getSentimentAnalysis() {
  const issues = await prisma.jiraIssue.findMany({ take: 50, orderBy: { createdAt: "desc" } });

  const context = issues
    .map((i) => `- ${i.summary} | status=${i.status} | priority=${i.priority} | type=${i.issueType}`)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are a Jira risk analyst. Detect frustration signals and urgency. Return strict JSON: {riskLevel: 'High|Medium|Low', explanation: string}."
      },
      {
        role: "user",
        content: `Analyze sentiment and risk based on issues:\n${context}`
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}");
}
