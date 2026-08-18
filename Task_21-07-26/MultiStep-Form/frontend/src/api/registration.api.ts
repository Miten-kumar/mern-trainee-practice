import { api } from "./axios";


// CREATE REGISTRATION

export const createRegistration =
async(data:FormData)=>{

    const response =
    await api.post(

        "/registrations",

        data,
        
        {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    );

    return response.data;
};

// GET ALL REGISTRATIONS

export const getRegistrations =
async()=>{

    const response =
    await api.get(
        "/registrations"
    );

    return response.data;
};

// GET SINGLE REGISTRATION

export const getRegistrationById =
async(id:number)=>{

    const response =
    await api.get(

        `/registrations/${id}`

    );

    return response.data;
};

// UPDATE REGISTRATION

export const updateRegistration =
async(
    id:number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data:any
)=>{

    const response =
    await api.put(

        `/registrations/${id}`,

        data
    );

    return response.data;
};

// DELETE REGISTRATION

export const deleteRegistration =
async(id:number)=>{

    const response =
    await api.delete(

        `/registrations/${id}`

    );

    return response.data;

};