import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <Link
          to="/"
          className="logo"
          aria-label="Performance Optimization home"
        >
          Performance App
        </Link>

        <nav aria-label="Main navigation">
          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;