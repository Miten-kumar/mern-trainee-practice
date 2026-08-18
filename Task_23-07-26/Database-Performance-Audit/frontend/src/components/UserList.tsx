import {
    useEffect,
    useState
} from "react";


import "../style/UserList.css";


import { getUsers } from "../services/userService";


import type {
    User
} from "../types";



function UserList(){


    const [users,setUsers]
    =
    useState<User[]>([]);



    const [loading,setLoading]
    =
    useState(true);



    const [error,setError]
    =
    useState("");



    useEffect(()=>{


        // eslint-disable-next-line react-hooks/immutability
        fetchUsers();


    },[]);




    const fetchUsers = async()=>{


        try{


            const data =
            await getUsers();


            setUsers(data);


        }


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(error){


            setError(
                "Failed to load users"
            );


        }


        finally{


            setLoading(false);


        }


    };



    if(loading){

        return (

            <h3 className="loading-text">
                Loading Users...
            </h3>

        );

    }



    if(error){

        return (

            <h3 className="error-text">
                {error}
            </h3>

        );

    }




    return (

        <div className="users-container">


            <h2>
                Users
            </h2>



            <div className="users-list">


            {
                users.map(
                    (user)=>(

                    <div 
                    className="user-card"
                    key={user.id}
                    >


                        <h3>
                            {user.name}
                        </h3>


                        <p>
                            Email:
                            {" "}
                            {user.email}
                        </p>



                        <p>
                            Total Orders:
                            {" "}
                            {user.orders.length}
                        </p>


                    </div>

                ))
            }


            </div>


        </div>

    );


}


export default UserList;