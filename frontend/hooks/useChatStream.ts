"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

export function useChatStream() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(query: string) {
    setLoading(true);
    setAnswer("");

    const res = await fetch(`${API_BASE}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        const payload = JSON.parse(line.replace("data: ", ""));
        if (payload.token) setAnswer((prev) => prev + payload.token);
      }
    }

    setLoading(false);
  }

  return { ask, answer, loading };
}
