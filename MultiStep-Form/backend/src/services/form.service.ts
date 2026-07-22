import prisma from "../config/prisma.js";


// Create Application Service

export const createApplicationService = async (
  data:any
)=>{


  const application =
    await prisma.application.create({

      data

    });


  return application;

};




// Get All Applications

export const getApplicationsService = async()=>{


  return await prisma.application.findMany({

    orderBy:{

      createdAt:"desc"

    }

  });

};




// Get Application By Id

export const getApplicationByIdService = async(
  id:number
)=>{


  return await prisma.application.findUnique({

    where:{

      id

    }

  });

};




// Update Application

export const updateApplicationService = async(

  id:number,

  data:any

)=>{


  return await prisma.application.update({

    where:{

      id

    },


    data

  });

};




// Delete Application

export const deleteApplicationService = async(

  id:number

)=>{


  return await prisma.application.delete({

    where:{

      id

    }

  });

};