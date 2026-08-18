import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <main className="dashboard-page">

      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Security Audit Dashboard
        </h1>

        <p className="dashboard-description">
          Monitor application security
          controls and remediation status.
        </p>
      </header>

      <section className="welcome-card">
        <h2>
          Welcome, {user?.name}
        </h2>

        <p>
          You are successfully authenticated.
        </p>

        <p>
          Email: {user?.email}
        </p>
      </section>

      <section>
        <h2 className="section-title">
          Security Controls
        </h2>

        <div className="security-grid">

          <article className="security-card">
            <h3>
              Authentication
            </h3>

            <p>
              ✓ Enabled
            </p>
          </article>

          <article className="security-card">
            <h3>
              CSRF Protection
            </h3>

            <p>
              ✓ Enabled
            </p>
          </article>

          <article className="security-card">
            <h3>
              XSS Protection
            </h3>

            <p>
              ✓ Enabled
            </p>
          </article>

          <article className="security-card">
            <h3>
              Security Headers
            </h3>

            <p>
              ✓ Enabled
            </p>
          </article>

          <article className="security-card">
            <h3>
              Rate Limiting
            </h3>

            <p>
              ✓ Enabled
            </p>
          </article>

          <article className="security-card">
            <h3>
              Input Validation
            </h3>

            <p>
              ✓ Enabled
            </p>
          </article>

        </div>
      </section>

      <nav className="dashboard-actions">

        <Link
          className="dashboard-link"
          to="/users"
        >
          Manage Users
        </Link>

        <Link
          className="dashboard-link"
          to="/security"
        >
          Security Details
        </Link>

      </nav>

    </main>
  );
};

export default Dashboard;