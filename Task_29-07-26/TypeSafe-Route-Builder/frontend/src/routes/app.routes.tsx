import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Users from "../pages/Users";
import UserDetails from "../pages/UserDetails";
import Products from "../pages/Products";
import RouteBuilder from "../pages/RouteBuilder";

import { ROUTES } from "./route.constants";


export default function AppRoutes(){

    return (

        <Routes>

            <Route

                path={ROUTES.HOME}

                element={<Home />}

            />

            <Route

                path={ROUTES.USERS}

                element={<Users />}

            />

            <Route

                path={ROUTES.USER_DETAILS}

                element={<UserDetails />}

            />

            <Route

                path={ROUTES.PRODUCTS}

                element={<Products />}

            />

            <Route

                path={ROUTES.PRODUCT_DETAILS}

                element={
                    <div className="p-10">

                        <h1 className="text-3xl font-bold">
                            Product Details
                        </h1>

                    </div>
                }

            />

            <Route

                path={ROUTES.ROUTE_BUILDER}

                element={<RouteBuilder />}

            />

            <Route

                path="*"

                element={

                    <div className="p-10">

                        <h1 className="text-4xl font-bold">
                            404 - Page Not Found
                        </h1>

                    </div>

                }

            />

        </Routes>

    );
}