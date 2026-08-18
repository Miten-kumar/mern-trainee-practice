const Security = () => {
  return (
    <main className="page-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Security Audit & Remediation
        </h1>

        <p className="dashboard-description">
          Security controls implemented
          in this application.
        </p>
      </header>

      <section>
        <h2 className="section-title">
          OWASP Security Controls
        </h2>

        <div className="security-grid">
          <article className="security-card">
            <h3>
              SQL Injection Protection
            </h3>

            <p>
              Prisma parameterized queries
            </p>
          </article>

          <article className="security-card">
            <h3>
              XSS Protection
            </h3>

            <p>
              React escaped rendering
            </p>
          </article>

          <article className="security-card">
            <h3>
              CSRF Protection
            </h3>

            <p>
              CSRF token for state-changing
              requests
            </p>
          </article>

          <article className="security-card">
            <h3>
              Security Headers
            </h3>

            <p>
              Helmet
            </p>
          </article>

          <article className="security-card">
            <h3>
              Authentication
            </h3>

            <p>
              HTTP-only cookies
            </p>
          </article>

          <article className="security-card">
            <h3>
              Authorization
            </h3>

            <p>
              Protected routes
            </p>
          </article>

          <article className="security-card">
            <h3>
              Rate Limiting
            </h3>

            <p>
              API abuse protection
            </p>
          </article>

          <article className="security-card">
            <h3>
              Input Validation
            </h3>

            <p>
              Frontend + backend validation
            </p>
          </article>

          <article className="security-card">
            <h3>
              Dependency Scanning
            </h3>

            <p>
              npm audit
            </p>
          </article>
        </div>
      </section>

      <section>
        <h2 className="section-title">
          Security Testing
        </h2>

        <div className="security-grid">
          <article className="security-card">
            <h3>
              Security Headers Tests
            </h3>

            <p>
              ✓ Implemented
            </p>
          </article>

          <article className="security-card">
            <h3>
              CSRF Tests
            </h3>

            <p>
              ✓ Implemented
            </p>
          </article>

          <article className="security-card">
            <h3>
              XSS Tests
            </h3>

            <p>
              ✓ Implemented
            </p>
          </article>

          <article className="security-card">
            <h3>
              SQL Injection Tests
            </h3>

            <p>
              ✓ Implemented
            </p>
          </article>

          <article className="security-card">
            <h3>
              Rate Limiting Tests
            </h3>

            <p>
              ✓ Implemented
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Security;