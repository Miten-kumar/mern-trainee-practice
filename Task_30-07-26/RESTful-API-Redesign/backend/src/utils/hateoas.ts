export const userHateoas = (
    userId:number
)=>{


return [

    {
        rel:"self",

        href:
        `/api/v1/users/${userId}`,

        method:"GET"
    },

    {
        rel:"update",

        href:
        `/api/v1/users/${userId}`,

        method:"PATCH"
    },


    {
        rel:"delete",

        href:
        `/api/v1/users/${userId}`,

        method:"DELETE"
    }
];

};

export const addHateoasLinks = (
    user:any
)=>{


return {

    ...user,


    _links:
    userHateoas(user.id)

};

};