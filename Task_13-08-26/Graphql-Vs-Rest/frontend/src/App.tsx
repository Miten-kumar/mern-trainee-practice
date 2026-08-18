import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Users from "./pages/Users";
import GraphQLUsers from "./pages/GraphQLUsers";
import Login from "./pages/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="app-container">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* REST Users */}
          <Route
            path="/rest-users"
            element={<Users />}
          />

          {/* GraphQL Users */}
          <Route
            path="/graphql-users"
            element={<GraphQLUsers />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;