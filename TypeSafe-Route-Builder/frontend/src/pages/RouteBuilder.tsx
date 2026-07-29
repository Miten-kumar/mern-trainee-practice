import { useState } from "react";
import RouteCard from "../components/Routecard";


export default function RouteBuilder() {

    const [routeType, setRouteType] =
        useState("user");


    const [id, setId] =
        useState("");


    const [category, setCategory] =
        useState("");


    const [sort, setSort] =
        useState<"asc" | "desc">("asc");



    const generatedUrl =
        routeType === "user"

            ? `/users/${id}`

            : routeType === "product"

            ? `/products/${id}`

            : `/products?category=${category}&sort=${sort}`;



    const routeTemplate =
        routeType === "user"

            ? "/users/:id"

            : routeType === "product"

            ? "/products/:id"

            : "/products?category=&sort=";



    return (

        <div className="
            min-h-[calc(100vh-80px)]
            bg-slate-100
            px-6
            py-10
        ">


            <div className="
                mx-auto
                max-w-3xl
            ">


                <div className="
                    rounded-2xl
                    bg-white
                    p-8
                    shadow-lg
                ">


                    <h1 className="
                        mb-6
                        text-4xl
                        font-bold
                        text-slate-800
                    ">

                        Route Builder

                    </h1>



                    {/* Route Selection */}

                    <div className="mb-6">

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                        ">

                            Select Route

                        </label>


                        <select

                            value={routeType}

                            onChange={
                                (e)=>
                                setRouteType(e.target.value)
                            }

                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                px-4
                                py-3
                            "

                        >

                            <option value="user">
                                /users/:id
                            </option>


                            <option value="product">
                                /products/:id
                            </option>


                            <option value="product-query">
                                /products?category=&sort=
                            </option>


                        </select>


                    </div>




                    {/* Route Template */}

                    <div className="mb-6">


                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                        ">

                            Route Template

                        </label>



                        <div className="
                            rounded-lg
                            bg-slate-100
                            px-4
                            py-3
                            font-mono
                            text-blue-600
                        ">

                            {routeTemplate}

                        </div>


                    </div>





                    {/* Dynamic Params */}


                    {
                        routeType !== "product-query" &&

                        <div className="mb-6">


                            <label className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                            ">

                                Enter ID

                            </label>


                            <input

                                type="text"

                                placeholder={
                                    routeType === "user"
                                    ?
                                    "Enter User ID"
                                    :
                                    "Enter Product ID"
                                }


                                value={id}


                                onChange={
                                    (e)=>
                                    setId(e.target.value)
                                }


                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                "

                            />


                        </div>

                    }





                    {/* Query Params */}

                    {
                        routeType === "product-query" &&

                        <div className="space-y-4 mb-6">


                            <input

                                placeholder="Category (electronics)"

                                value={category}

                                onChange={
                                    (e)=>
                                    setCategory(e.target.value)
                                }

                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    px-4
                                    py-3
                                "

                            />



                            <select

                                value={sort}

                                onChange={
                                    (e)=>
                                    setSort(
                                        e.target.value as "asc"|"desc"
                                    )
                                }


                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    px-4
                                    py-3
                                "

                            >

                                <option value="asc">
                                    Price Low to High
                                </option>


                                <option value="desc">
                                    Price High to Low
                                </option>


                            </select>


                        </div>

                    }




                    {/* Generated URL */}

                    <div className="
                        mb-8
                        rounded-lg
                        bg-green-50
                        p-4
                    ">


                        <p className="
                            text-sm
                            font-semibold
                            text-green-700
                        ">

                            Generated URL

                        </p>


                        <p className="
                            mt-2
                            font-mono
                            text-lg
                            text-green-900
                        ">

                            {generatedUrl}

                        </p>


                    </div>




                    <RouteCard

                        route={routeTemplate}

                        generatedUrl={generatedUrl}

                    />


                </div>


            </div>


        </div>

    );

}