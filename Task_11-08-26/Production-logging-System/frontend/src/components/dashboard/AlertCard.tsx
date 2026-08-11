import type { AlertEvent } from "../../types/monitoring.types";

interface Props {
  alerts: AlertEvent[];
}

export default function AlertCard({ alerts }: Props) {
  const active = alerts.filter((alert) => !alert.resolved);

  return (
    <div className="card">
      <h3>Critical Alerts</h3>

      <div className="stats">
        <div>
          <h2>{active.length}</h2>
          <span>Active Alerts</span>
        </div>
      </div>

      <div className="list">
        {active.slice(0, 5).map((alert) => (
          <div key={alert.id} className="alert-item">
            <div className={`severity ${alert.severity}`}>
              {alert.severity.toUpperCase()}
            </div>

            <p>{alert.message}</p>

            <small>{alert.type}</small>
          </div>
        ))}

        {active.length === 0 && (
          <p>No active alerts.</p>
        )}
      </div>
    </div>
  );
}