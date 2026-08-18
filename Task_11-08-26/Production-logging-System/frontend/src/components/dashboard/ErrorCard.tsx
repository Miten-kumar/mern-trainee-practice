import type { ApplicationError } from "../../types/monitoring.types";

interface Props {
  errors: ApplicationError[];
}

export default function ErrorCard({ errors }: Props) {
  const critical = errors.filter(
    (error) => (error.statusCode ?? 0) >= 500
  );

  return (
    <div className="card">
      <h3>Application Errors</h3>

      <div className="stats">
        <div>
          <h2>{errors.length}</h2>
          <span>Total Errors</span>
        </div>

        <div>
          <h2>{critical.length}</h2>
          <span>Critical</span>
        </div>
      </div>

      <div className="list">
        {errors.slice(0, 5).map((error) => (
          <div key={error.id} className="list-item">
            <strong>{error.statusCode ?? 500}</strong>

            <p>{error.message}</p>

            <small>{error.route ?? "Unknown Route"}</small>
          </div>
        ))}

        {errors.length === 0 && (
          <p>No application errors found.</p>
        )}
      </div>
    </div>
  );
}