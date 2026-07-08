import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { lazy, Suspense } from "react";

import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>Complete File Upload System</h2>

        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About
          </NavLink>
        </div>
      </nav>

      <Suspense fallback={<h2 style={{ textAlign: "center" }}>Loading...</h2>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;