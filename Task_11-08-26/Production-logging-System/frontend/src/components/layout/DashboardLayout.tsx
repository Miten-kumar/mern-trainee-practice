import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="dashboard-layout">
      <header className="header">
        <h1>Production Logging System</h1>

        <p>
          Winston • PostgreSQL • Performance Monitoring
        </p>
      </header>

      <main>{children}</main>

      <footer className="footer">
        © 2026 Production Monitoring Dashboard
      </footer>
    </div>
  );
}