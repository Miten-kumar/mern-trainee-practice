import BackendStatus from "../components/BackendStatus";

function Home() {
  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <span className="badge">● CI/CD Pipeline</span>

          <h1>Complete CI/CD Pipeline</h1>

          <p>
            Production-ready frontend connected to a TypeScript backend
            with automated testing, Docker, and deployment support.
          </p>
        </header>

        <section className="status-grid">
          <div className="status-card">
            <h3>Frontend</h3>

            <div className="status-value">
              <span className="status-dot" />
              Running
            </div>
          </div>

          <div className="status-card">
            <h3>Backend</h3>

            <div className="status-value">
              <span className="status-dot" />
              API Connected
            </div>
          </div>

          <div className="status-card">
            <h3>Database</h3>

            <div className="status-value">
              <span className="status-dot" />
              PostgreSQL
            </div>
          </div>
        </section>

        <BackendStatus />

        <section className="pipeline-card">
          <h2>Deployment Pipeline</h2>

          <div className="pipeline">
            <div className="pipeline-step">
              <strong>Code</strong>
              <span>Git Push</span>
            </div>

            <span className="pipeline-arrow">→</span>

            <div className="pipeline-step">
              <strong>Test</strong>
              <span>Lint + Tests</span>
            </div>

            <span className="pipeline-arrow">→</span>

            <div className="pipeline-step">
              <strong>Build</strong>
              <span>Docker Image</span>
            </div>

            <span className="pipeline-arrow">→</span>

            <div className="pipeline-step">
              <strong>Staging</strong>
              <span>Smoke Tests</span>
            </div>

            <span className="pipeline-arrow">→</span>

            <div className="pipeline-step">
              <strong>Production</strong>
              <span>Approval</span>
            </div>
          </div>
        </section>

        <footer className="footer">
          Complete CI/CD Pipeline • React + TypeScript + Node.js
        </footer>
      </div>
    </div>
  );
}

export default Home;