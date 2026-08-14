import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        The page you are looking for
        does not exist or has been moved.
      </p>

      <Link to="/">
        Go to Dashboard
      </Link>
    </main>
  );
};

export default NotFoundPage;