import { NavLink } from "react-router-dom";
import "./components.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          GraphQL vs REST
        </div>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/rest-users"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            REST Users
          </NavLink>

            {/* Login */}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/graphql-users"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            GraphQL Users
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;