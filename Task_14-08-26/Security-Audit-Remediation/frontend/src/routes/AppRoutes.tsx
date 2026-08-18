import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import Dashboard from "../pages/DashboardPage";
import Users from "../pages/UsersPage";
import Security from "../pages/SecurityPage";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected routes */}

        <Route
          element={<ProtectedRoute />}
        >
          <Route
            element={<MainLayout />}
          >
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/users"
              element={<Users />}
            />

            <Route
              path="/security"
              element={<Security />}
            />
          </Route>
        </Route>

        {/* 404 */}

        <Route
          path="*"
          element={
            <div>
              <h1>404</h1>
              <p>
                Page not found
              </p>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;