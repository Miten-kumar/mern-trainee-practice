import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Navbar from "./component/Navbar";
import Home from "./pages/Home";

const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense
        fallback={
          <h2 style={{ textAlign: "center", marginTop: "50px" }}>
            Loading Analytics...
          </h2>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;