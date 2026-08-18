import { Request, Response } from "express";
import prisma from "../config/prisma";


// CREATE REGISTRATION

export const createRegistration = async(
    req:Request,
    res:Response
)=>{

    try{
        const {

            firstName,
            lastName,
            email,
            phone,
            age,
            employmentStatus,
            company,
            designation,
            experience,
            skills

        } = req.body;

        const resume =
            req.files &&
            (req.files as any).resume
            ?
            `/uploads/${
                (req.files as any).resume[0].filename
            }`
            :
            null;

        const profileImage =
            req.files &&
            (req.files as any).profileImage
            ?
            `/uploads/${
                (req.files as any).profileImage[0].filename
            }`
            :
            null;

        const registration =
        await prisma.registration.create({

            data:{

                firstName,

                lastName,

                email,

                phone,

                age:Number(age),

                employmentStatus,

                company,

                designation,

                experience:
                experience
                ?
                Number(experience)
                :
                null,

                resume,

                profileImage,

                skills:{

                    create:
                    skills
                    ?
                    JSON.parse(skills)
                    :
                    []
                }
            },
            include:{
                skills:true
            }
        });

        res.status(201).json({

            success:true,

            message:"Registration created successfully",

            data:registration

        });
    }
    catch(error:any){

        res.status(500).json({

            success:false,

            message:error.message

        });
    }
};

// GET ALL

export const getRegistrations = async(
    req:Request,
    res:Response
)=>{

    try{
        const registrations =
        await prisma.registration.findMany({

            include:{
                skills:true
            },

            orderBy:{
                createdAt:"desc"
            }
        });

        res.json({

            success:true,

            data:registrations

        });
    }
    catch(error:any){

        res.status(500).json({

            success:false,

            message:error.message

        });
    }
};

// GET BY ID

export const getRegistrationById = async(
    req:Request,
    res:Response
)=>{

    try{

        const id =
        Number(req.params.id);

        const registration =
        await prisma.registration.findUnique({

            where:{
                id
            },

            include:{
                skills:true
            }
        });

        if(!registration){

            return res.status(404).json({

                success:false,

                message:"Registration not found"

            });
        }

        res.json({

            success:true,

            data:registration

        });
    }
    catch(error:any){

        res.status(500).json({

            success:false,

            message:error.message

        });
    }
};

// UPDATE

export const updateRegistration = async(
    req:Request,
    res:Response
)=>{

    try{

        const id =
        Number(req.params.id);

        const updated =
        await prisma.registration.update({

            where:{
                id
            },

            data:req.body
        });

        res.json({

            success:true,

            data:updated
        });
    }
    catch(error:any){

        res.status(500).json({

            success:false,

            message:error.message

        });
    }
};

// DELETE

export const deleteRegistration = async(
    req:Request,
    res:Response
)=>{

    try{

        const id =
        Number(req.params.id);

        await prisma.registration.delete({

            where:{
                id
            }
        });

        res.json({

            success:true,

            message:"Deleted successfully"

        });
    }
    catch(error:any){

        res.status(500).json({

            success:false,

            message:error.message
        });
    }
};