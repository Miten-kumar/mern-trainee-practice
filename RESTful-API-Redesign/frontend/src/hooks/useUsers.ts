import {

    useQuery,

    useMutation,

    useQueryClient

}
from "@tanstack/react-query";



import {

    getUsers,

    getUserById,

    createUser,

    updateUser,

    deleteUser

}
from "../api/user.api";



import type {

    CreateUserRequest,

    UpdateUserRequest

} from "../types/user.types";




// GET ALL USERS

export const useUsers = ()=>{


return useQuery({

    queryKey:["users"],

    queryFn:getUsers


});


};





// GET USER BY ID

export const useUserById = (

    id:number

)=>{


return useQuery({


    queryKey:["user",id],


    queryFn:()=>getUserById(id),


    enabled:!!id


});


};






// CREATE USER

export const useCreateUser = ()=>{


const queryClient =
useQueryClient();



return useMutation({


    mutationFn:
    (
        userData:CreateUserRequest

    )=>

    createUser(userData),




    onSuccess:()=>{


        queryClient.invalidateQueries({

            queryKey:["users"]

        });


    }



});


};







// UPDATE USER

export const useUpdateUser = ()=>{


const queryClient =
useQueryClient();




return useMutation({


mutationFn:

({

id,

data

}:

{

id:number;

data:UpdateUserRequest;

})=>

updateUser(

id,

data

),





onSuccess:

(

_,variables

)=>{


queryClient.invalidateQueries({

    queryKey:["users"]

});



queryClient.invalidateQueries({

    queryKey:["user",variables.id]

});


}



});


};







// DELETE USER

export const useDeleteUser = ()=>{


const queryClient =
useQueryClient();



return useMutation({


    mutationFn:
    (
        id:number

    )=>

    deleteUser(id),





    onSuccess:()=>{


        queryClient.invalidateQueries({

            queryKey:["users"]

        });


    }



});


};