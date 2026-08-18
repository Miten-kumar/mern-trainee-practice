import { useEffect, useState } from "react";
import api from "../api/api";
import type { HealthResponse } from "../types/api.types";

function BackendStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkBackend = async (): Promise<void> => {
      try {
        const response = await api.get<HealthResponse>("/health");

        setHealth(response.data);
      } catch (err) {
        console.error("Backend connection failed:", err);

        setError("Backend is not available");
      } finally {
        setLoading(false);
      }
    };

    void checkBackend();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        Checking backend connection...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-card">
        <h2>Backend Connection</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="connection-card">
      <div className="connection-header">
        <h2>Backend Connection</h2>

        <span className="connection-status">
          Connected
        </span>
      </div>

      <div className="info-list">
        <div className="info-row">
          <span className="info-label">API Status</span>

          <span className="info-value">
            {health?.status}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Database</span>

          <span className="info-value">
            {health?.database}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Environment</span>

          <span className="info-value">
            {health?.environment}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">API Endpoint</span>

          <span className="info-value">
            {import.meta.env.VITE_API_URL}
          </span>
        </div>
      </div>
    </section>
  );
}

export default BackendStatus;