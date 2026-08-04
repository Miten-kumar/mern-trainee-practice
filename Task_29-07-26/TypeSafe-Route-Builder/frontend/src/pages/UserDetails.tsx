import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../api/user.api";
import type { User } from "../types/user.types";


export default function UserDetails(){

    const {
        id
    } = useParams();


    const [user,setUser] =
        useState<User | null>(null);


    useEffect(()=>{

        if(id){

            getUserById(
                Number(id)
            )

            .then(
                response=>{

                    setUser(
                        response.data
                    );

                }
            );
        }

    },[id]);


    if(!user){

        return <h2>Loading...</h2>;
    }

    return (

        <div>

            <h1>
                User Details
            </h1>

            <p>
                ID: {user.id}
            </p>

            <p>
                Name: {user.name}
            </p>

            <p>
                Email: {user.email}
            </p>

        </div>
    );
}