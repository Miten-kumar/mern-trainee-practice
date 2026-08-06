import prisma from "../config/prisma";


interface RegistrationData {

    firstName:string;

    lastName:string;

    email:string;

    phone:string;

    age:number;

    employmentStatus:
    "STUDENT" |
    "EMPLOYED" |
    "FREELANCER" |
    "UNEMPLOYED";

    company?:string;

    designation?:string;

    experience?:number;

    resume?:string;

    profileImage?:string;

    skills?:{
        name:string;
    }[];

}

// CREATE

export const createRegistrationService =
async(data:RegistrationData)=>{

    const registration =
    await prisma.registration.create({

        data:{

            firstName:data.firstName,

            lastName:data.lastName,

            email:data.email,

            phone:data.phone,

            age:data.age,

            employmentStatus:
            data.employmentStatus,

            company:data.company,

            designation:data.designation,

            experience:data.experience,


            resume:data.resume,

            profileImage:data.profileImage,

            skills:{

                create:
                data.skills || []

            }
        },

        include:{
            skills:true
        }
    });

    return registration;
};

// GET ALL

export const getAllRegistrationService =
async()=>{

    return await prisma.registration.findMany({

        include:{
            skills:true
        },

        orderBy:{
            createdAt:"desc"
        }
    });
};

// GET BY ID

export const getRegistrationByIdService =
async(id:number)=>{

    return await prisma.registration.findUnique({

        where:{
            id
        },

        include:{
            skills:true
        }
    });
};

// UPDATE

export const updateRegistrationService =
async(
    id:number,
    data:any
)=>{

    return await prisma.registration.update({

        where:{
            id
        },
        data
    });
};

// DELETE

export const deleteRegistrationService =
async(id:number)=>{

    return await prisma.registration.delete({

        where:{
            id
        }
    });
};