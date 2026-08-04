import {
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";


import {

    useUsers,

    useCreateUser,

    useUpdateUser,

    useDeleteUser

}
from "../hooks/useUsers";



import UserTable
from "../components/UserTable";


import UserForm
from "../components/UserForm";


import Loader
from "../components/Loder";


import ErrorMessage
from "../components/ErrorMessage";



import type {
    User
}
from "../types/user.types";


import "../style/users.css";






const Users = ()=>{


    const navigate =
    useNavigate();




    const [
        selectedUser,

        setSelectedUser

    ] = useState<User | null>(null);





    const {

        data,

        isLoading,

        error

    } = useUsers();






    const createMutation =
    useCreateUser();



    const updateMutation =
    useUpdateUser();



    const deleteMutation =
    useDeleteUser();







    if(isLoading)

        return <Loader/>;






    if(error)

        return (

            <ErrorMessage

                message="Failed to fetch users"

            />

        );






    const users =
    data?.data || [];






    const handleSubmit = (

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData:any

    )=>{


        if(selectedUser){


            updateMutation.mutate({

                id:selectedUser.id,

                data:formData

            });



            setSelectedUser(null);


        }

        else{


            createMutation.mutate(

                formData

            );


        }


    };







    const handleEdit = (

        user:User

    )=>{


        setSelectedUser(user);


    };







    const handleView = (

        user:User

    )=>{


        navigate(

            `/users/${user.id}`

        );


    };








    const handleDelete = (

        id:number

    )=>{


        const confirmDelete =

        window.confirm(

            "Delete this user?"

        );



        if(confirmDelete){


            deleteMutation.mutate(id);


        }


    };







    return (

        <div className="users-container">



            <div className="page-header">


                <h1>

                    Users Management

                </h1>



                <button

                    className="btn btn-primary"

                >

                    + Add User

                </button>


            </div>





            <UserTable


                users={users}


                onEdit={handleEdit}


                onView={handleView}


                onDelete={handleDelete}


            />







            <UserForm


                selectedUser={selectedUser}


                onSubmit={handleSubmit}


                onCancel={()=>

                    setSelectedUser(null)

                }


            />



        </div>

    );


};



export default Users;