type Issue = {
  id: string;
  summary: string;
  status: string;
  priority: string;
  assignee?: string;
};

export function IssuesTable({ issues }: { issues: Issue[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-800/70 text-slate-300">
          <tr>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Summary</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Priority</th>
            <th className="px-3 py-2 text-left">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id} className="border-t border-slate-800">
              <td className="px-3 py-2">{issue.id}</td>
              <td className="px-3 py-2">{issue.summary}</td>
              <td className="px-3 py-2">{issue.status}</td>
              <td className="px-3 py-2">{issue.priority}</td>
              <td className="px-3 py-2">{issue.assignee ?? "Unassigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
