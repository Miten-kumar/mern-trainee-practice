import { useEffect, useState } from "react";

import { getUsers } from "../api/user.api";

import type { User } from "../types/user.types";

import UserCard from "../components/Usercard";


export default function Users(){

    const [users,setUsers] =
        useState<User[]>([]);


    const [loading,setLoading] =
        useState(true);



    useEffect(()=>{


        getUsers()

        .then((response)=>{

            setUsers(
                response.data
            );

        })

        .finally(()=>{

            setLoading(false);

        });


    },[]);



    return (

        <div className="
            min-h-[calc(100vh-80px)]
            bg-slate-100
            px-6
            py-10
        ">


            <div className="
                mx-auto
                max-w-7xl
            ">


                <div className="
                    mb-8
                ">


                    <h1 className="
                        text-4xl
                        font-bold
                        text-slate-800
                    ">

                        Users

                    </h1>


                    <p className="
                        mt-2
                        text-slate-600
                    ">

                        Type-safe user routes demonstration

                    </p>


                </div>



                {
                    loading &&

                    <div className="
                        rounded-xl
                        bg-white
                        p-6
                        text-center
                        shadow
                    ">

                        <p className="
                            text-slate-600
                        ">

                            Loading users...

                        </p>

                    </div>

                }



                {
                    !loading && users.length === 0 &&

                    <div className="
                        rounded-xl
                        bg-white
                        p-6
                        text-center
                        shadow
                    ">

                        <p className="
                            text-slate-600
                        ">

                            No users found

                        </p>

                    </div>

                }




                {
                    !loading && users.length > 0 &&

                    <div className="
                        grid
                        gap-6
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">


                        {
                            users.map(
                                (user)=>(

                                    <UserCard

                                        key={user.id}

                                        user={user}

                                    />

                                )
                            )
                        }


                    </div>

                }


            </div>


        </div>

    );

}