import { Link } from "react-router-dom";
import "./pages.css";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <span className="hero-badge">
          API Comparison Project
        </span>

        <h1>
          GraphQL vs REST
        </h1>

        <p className="hero-description">
          Compare REST and GraphQL APIs using the
          same backend, database, and business
          logic.
        </p>

        <div className="hero-actions">
          <Link
            to="/rest-users"
            className="page-button rest-button"
          >
            Explore REST
          </Link>

          <Link
            to="/graphql-users"
            className="page-button graphql-button"
          >
            Explore GraphQL
          </Link>
        </div>
      </section>

      <section className="comparison-section">
        <h2>
          REST vs GraphQL
        </h2>

        <div className="comparison-grid">
          <div className="comparison-card">
            <div className="comparison-icon rest-icon">
              R
            </div>

            <h3>REST API</h3>

            <p>
              Uses resource-based endpoints and
              HTTP methods such as GET, POST,
              PUT, and DELETE.
            </p>

            <ul>
              <li>Simple and widely adopted</li>
              <li>HTTP caching support</li>
              <li>Easy to understand</li>
            </ul>
          </div>

          <div className="comparison-card">
            <div className="comparison-icon graphql-icon">
              G
            </div>

            <h3>GraphQL API</h3>

            <p>
              Allows clients to request exactly
              the fields they need through a
              single endpoint.
            </p>

            <ul>
              <li>Flexible field selection</li>
              <li>Reduces over-fetching</li>
              <li>Strongly typed schema</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;