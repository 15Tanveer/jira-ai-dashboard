"use client";

import { useState } from "react";
import { useChatStream } from "../hooks/useChatStream";

export function ChatPanel() {
  const [query, setQuery] = useState("Why is this project at risk?");
  const { ask, answer, loading } = useChatStream();

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">RAG Chat Assistant</h2>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-slate-700 bg-slate-950 p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="rounded bg-sky-600 px-3 py-2" onClick={() => ask(query)} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
      <pre className="mt-4 min-h-40 whitespace-pre-wrap rounded bg-slate-950 p-3 text-sm">{answer}</pre>
    </section>
  );
}
