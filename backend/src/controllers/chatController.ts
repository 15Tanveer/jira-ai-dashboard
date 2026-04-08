import { Request, Response } from "express";
import { askJiraAssistant } from "../rag/chatService";

export async function chatController(req: Request, res: Response) {
  const { query } = req.body as { query?: string };
  if (!query) {
    return res.status(400).json({ error: "query is required" });
  }

  const data = await askJiraAssistant(query);
  return res.json(data);
}

export async function chatStreamController(req: Request, res: Response) {
  const { query } = req.body as { query?: string };
  if (!query) {
    return res.status(400).json({ error: "query is required" });
  }

  const data = await askJiraAssistant(query);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const text = data.answer ?? "";
  for (const chunk of text.split(" ")) {
    res.write(`data: ${JSON.stringify({ token: `${chunk} ` })}\n\n`);
  }
  res.write(`data: ${JSON.stringify({ done: true, supportingIssues: data.supportingIssues })}\n\n`);
  res.end();
}
