import type { PerformanceMetric } from "../../types/monitoring.types";

interface Props {
  metrics: PerformanceMetric[];
}

export default function MetricsCard({ metrics }: Props) {
  const totalRequests = metrics.length;

  const average =
    totalRequests === 0
      ? 0
      : metrics.reduce(
          (sum, metric) => sum + metric.responseTime,
          0
        ) / totalRequests;

  const successRequests = metrics.filter(
    (metric) => metric.statusCode < 400
  ).length;

  return (
    <div className="card">
      <h3>Performance Metrics</h3>

      <div className="stats">
        <div>
          <h2>{totalRequests}</h2>
          <span>Total Requests</span>
        </div>

        <div>
          <h2>{average.toFixed(1)} ms</h2>
          <span>Avg Response</span>
        </div>

        <div>
          <h2>{successRequests}</h2>
          <span>Successful</span>
        </div>
      </div>
    </div>
  );
}