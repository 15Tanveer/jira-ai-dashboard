import { HealthChart } from "../components/HealthChart";
import { KpiCard } from "../components/KpiCard";
import { fetchJson } from "../lib/api";

type ProjectHealth = {
  health: string;
  metrics: {
    backlogPct: number;
    completedPct: number;
    highCriticalPct: number;
    unresolvedBugRatio: number;
    velocity: number;
  };
  statusBuckets: { backlog: number; inProgress: number; completed: number };
};

type Sentiment = { riskLevel: string; explanation: string };

export default async function DashboardPage() {
  const [health, sentiment] = await Promise.all([
    fetchJson<ProjectHealth>("/metrics/project-health"),
    fetchJson<Sentiment>("/metrics/sentiment")
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Jira AI Analytics Dashboard</h1>

      <section className="grid gap-4 md:grid-cols-4">
        <KpiCard title="Project Health" value={health.health} />
        <KpiCard title="Backlog %" value={`${health.metrics.backlogPct.toFixed(1)}%`} />
        <KpiCard title="High/Critical %" value={`${health.metrics.highCriticalPct.toFixed(1)}%`} />
        <KpiCard title="Sentiment Risk" value={sentiment.riskLevel} subtitle={sentiment.explanation} />
      </section>

      <HealthChart
        backlog={health.statusBuckets.backlog}
        inProgress={health.statusBuckets.inProgress}
        completed={health.statusBuckets.completed}
      />
    </div>
  );
}
