import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-slate-900"
        >
          Transaction Management
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={
              location.pathname === "/"
                ? "font-semibold text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            Products
          </Link>

          <Link
            to="/order"
            className={
              location.pathname === "/order"
                ? "font-semibold text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            Order
          </Link>
        </div>
      </div>
    </nav>
  );
}