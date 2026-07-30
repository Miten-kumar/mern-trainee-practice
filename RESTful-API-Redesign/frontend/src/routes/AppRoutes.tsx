import { Routes, Route } from "react-router-dom";
import Users from "../pages/Users";
import UserDetails from "../pages/UserDetails";

const AppRoutes = ()=>{

return (

<Routes>

{/* Users List + Create + Update */}

<Route

path="/"

element={<Users/>}

/>

<Route

path="/users"

element={<Users/>}

/>

{/* User Details */}

<Route

path="/users/:id"

element={<UserDetails/>}

/>

</Routes>

);

};

export default AppRoutes;