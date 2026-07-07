import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { lazy, Suspense } from "react";

import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #ddd",
          marginBottom: "30px",
        }}
      >
        <Link
          to="/"
          style={{
            marginRight: "20px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Home
        </Link>

        <Link
          to="/about"
          style={{
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          About
        </Link>
      </div>

      <Suspense fallback={<h2>Loading...</h2>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;