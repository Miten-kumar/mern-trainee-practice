import { useEffect, useState } from "react";

import { getHealth } from "../api/health.api";

import {
  getAlerts,
  getErrors,
  getMetrics,
} from "../api/monitoring.api";

import HealthCard from "../components/dashboard/HealthCard";
import MetricsCard from "../components/dashboard/MetricsCard";
import ErrorCard from "../components/dashboard/ErrorCard";
import AlertCard from "../components/dashboard/AlertCard";

import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

import DashboardLayout from "../components/layout/DashboardLayout";

import type {
  HealthResponse,
  PerformanceMetric,
  ApplicationError,
  AlertEvent,
} from "../types/monitoring.types";

export default function Dashboard() {
  const [health, setHealth] =
    useState<HealthResponse | null>(null);

  const [metrics, setMetrics] =
    useState<PerformanceMetric[]>([]);

  const [errors, setErrors] =
    useState<ApplicationError[]>([]);

  const [alerts, setAlerts] =
    useState<AlertEvent[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const [
        healthData,
        metricsData,
        errorsData,
        alertsData,
      ] = await Promise.all([
        getHealth(),
        getMetrics(),
        getErrors(),
        getAlerts(),
      ]);

      setHealth(healthData);
      setMetrics(metricsData);
      setErrors(errorsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error(
        "Dashboard loading failed:",
        error
      );

      setError(
        "Unable to load monitoring data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} />
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h2>Monitoring Dashboard</h2>

            <p>
              Monitor application health,
              performance, errors and alerts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadDashboard();
            }}
          >
            Refresh
          </button>
        </div>

        <section className="dashboard-grid">
          <HealthCard health={health} />

          <MetricsCard
            metrics={metrics}
          />

          <ErrorCard
            errors={errors}
          />

          <AlertCard
            alerts={alerts}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}