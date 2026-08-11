import type { HealthResponse } from "../../types/monitoring.types";

interface Props {
  health: HealthResponse | null;
}

export default function HealthCard({ health }: Props) {
  if (!health) return null;

  const healthy =
    health.status === "healthy" &&
    health.database === "connected";

  return (
    <div className="card">
      <h3>System Health</h3>

      <div className={healthy ? "badge green" : "badge red"}>
        {healthy ? "Healthy" : "Unhealthy"}
      </div>

      <div className="card-content">
        <p>
          <strong>Database:</strong> {health.database}
        </p>

        <p>
          <strong>Uptime:</strong>{" "}
          {Math.floor(health.uptime)} sec
        </p>

        <p>
          <strong>Updated:</strong>{" "}
          {new Date(health.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}