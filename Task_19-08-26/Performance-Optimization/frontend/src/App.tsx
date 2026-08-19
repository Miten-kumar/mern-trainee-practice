import {
  lazy,
  Suspense,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Header from "./components/Header";

const Home = lazy(
  () => import("./pages/Home")
);

const Products = lazy(
  () => import("./pages/Products")
);

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Suspense
        fallback={
          <main
            className="page-loading"
            aria-live="polite"
          >
            <p>Loading page...</p>
          </main>
        }
      >
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;