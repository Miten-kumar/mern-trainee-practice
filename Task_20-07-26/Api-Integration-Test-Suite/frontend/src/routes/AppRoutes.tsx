import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Users from "../pages/Users";

import ProtectedRoute from "../components/ProtectedRoute";


const AppRoutes = () => {

  return (

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />


      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />


      <Route
        path="*"
        element={<Login />}
      />


    </Routes>

  );

};


export default AppRoutes;