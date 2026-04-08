import { hybridSearch } from "./hybridQueryService";
import { openai } from "../utils/openai";

export async function askJiraAssistant(query: string) {
  const search = await hybridSearch(query);

  const issuesContext = search.issues
    .map((i) => `- [${i.id}] ${i.summary} | status=${i.status} | priority=${i.priority} | assignee=${i.assignee ?? "N/A"}`)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are a Jira AI analyst and project manager advisor. Give concise answers, root-cause insights, and actionable recommendations based only on provided issues."
      },
      {
        role: "user",
        content: `User query: ${query}\nIntent: ${search.intent}\nRelevant issues:\n${issuesContext}`
      }
    ]
  });

  return {
    answer: completion.choices[0].message.content,
    supportingIssues: search.issues,
    intent: search.intent
  };
}
