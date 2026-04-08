"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b"];

export function HealthChart({ backlog, inProgress, completed }: { backlog: number; inProgress: number; completed: number }) {
  const data = [
    { name: "Backlog", value: backlog },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed }
  ];

  return (
    <div className="h-64 rounded-xl border border-slate-800 bg-slate-900 p-3">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={85} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
