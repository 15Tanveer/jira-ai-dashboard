"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Item = { assignee: string; totalAssigned: number; completed: number };

export function UtilizationChart({ data }: { data: Item[] }) {
  return (
    <div className="h-72 rounded-xl border border-slate-800 bg-slate-900 p-3">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#334155" />
          <XAxis dataKey="assignee" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="totalAssigned" fill="#0ea5e9" />
          <Bar dataKey="completed" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
