import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

function App(){

    return (

        <BrowserRouter>


            <Navbar />


            <Routes>


                <Route

                    path="/"

                    element={
                        <Dashboard />
                    }

                />

                <Route

                    path="/users"

                    element={
                        <Users />
                    }

                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;