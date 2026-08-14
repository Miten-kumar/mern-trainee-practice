import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const MainLayout = () => {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout =
    async (): Promise<void> => {
      try {
        await logout();
      } finally {
        navigate("/login", {
          replace: true,
        });
      }
    };

  return (
    <div className="app-layout">

      <header className="navbar">

        <Link
          to="/"
          className="navbar-brand"
        >
          Security Audit
        </Link>

        <nav className="navbar-links">

          <Link to="/">
            Dashboard
          </Link>

          <Link to="/users">
            Users
          </Link>

          <Link to="/security">
            Security
          </Link>

          <span className="navbar-user">
            {user?.name}
          </span>

          <button
            className="logout-button"
            type="button"
            onClick={() => {
              void handleLogout();
            }}
          >
            Logout
          </button>

        </nav>

      </header>

      <main className="page-container">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;