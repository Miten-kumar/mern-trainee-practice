import {
    Routes,
    Route
} from "react-router-dom";


import Home from "../pages/Home";

import Users from "../pages/Users";

import Dashboard from "../pages/Dashboard";


import PageErrorBoundary
from "../components/ErrorBoundary/PageErrorBoundary";


import FallbackUI
from "../components/FallbackUI";



const AppRoutes = () => {


    return (


        <Routes>


            <Route

                path="/"

                element={

                    <PageErrorBoundary>

                        <Home />

                    </PageErrorBoundary>

                }

            />



            <Route

                path="/users"

                element={

                    <PageErrorBoundary>

                        <Users />

                    </PageErrorBoundary>

                }

            />



            <Route

                path="/dashboard"

                element={

                    <PageErrorBoundary>

                        <Dashboard />

                    </PageErrorBoundary>

                }

            />



            <Route

                path="*"

                element={

                    <FallbackUI

                        title="404 Page Not Found"

                        message="The page you are looking for does not exist."

                    />

                }

            />


        </Routes>


    );


};

export default AppRoutes;