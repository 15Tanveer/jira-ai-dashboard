import { IssuesTable } from "../../components/IssuesTable";
import { UtilizationChart } from "../../components/UtilizationChart";
import { fetchJson } from "../../lib/api";

type Util = {
  assignee: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  utilization: string;
};

type Resp = { assignees: Util[] };
type OverburnResp = {
  items: Array<{ id: string; summary: string; status: string; priority: string; assignee?: string }>;
};

export default async function AssigneesPage() {
  const [utilization, overburn] = await Promise.all([
    fetchJson<Resp>("/metrics/utilization"),
    fetchJson<OverburnResp>("/metrics/overburn")
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assignee Analytics</h1>
      <UtilizationChart data={utilization.assignees} />
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-2 text-lg font-semibold">Utilization Summary</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {utilization.assignees.map((a) => (
            <li key={a.assignee} className="rounded border border-slate-800 p-3">
              <strong>{a.assignee}</strong>: {a.utilization} ({a.totalAssigned} assigned)
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Overburnt Items</h2>
        <IssuesTable issues={overburn.items} />
      </div>
    </div>
  );
}
