import { Suspense, lazy } from "react";
import { RouterProvider, useRouter, Link } from "./router.jsx";

// each page is its own chunk, only loaded when the route is visited
const Home = lazy(() => import("./pages/Home.jsx"));
const ItemDetail = lazy(() => import("./pages/ItemDetail.jsx"));
const About = lazy(() => import("./pages/About.jsx"));

function Pages() {
  const { path } = useRouter();

  if (path.startsWith("/items/")) {
    const id = path.split("/items/")[1];
    return <ItemDetail id={id} />;
  }
  if (path === "/about") return <About />;
  return <Home />;
}

export default function App() {
  return (
    <RouterProvider>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Suspense fallback={<div className="page-loading">Loading page...</div>}>
        <Pages />
      </Suspense>
    </RouterProvider>
  );
}
