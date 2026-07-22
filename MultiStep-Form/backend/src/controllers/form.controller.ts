import { Request, Response } from "express";
import prisma from "../config/prisma.js";



// Create Application
export const createApplication = async (
  req: Request,
  res: Response
) => {

  try {

    console.log("HEADERS:", req.headers["content-type"]);
    console.log("BODY:", req.body);

    console.log("FILES:", req.files);



    const {

      firstName,
      lastName,
      email,
      phone,
      age,
      employmentType,
      companyName,
      experience,
      skills,
      portfolioUrl

    } = req.body;




    const files = req.files as {
      [fieldname:string]: Express.Multer.File[];
    } | undefined;




    const resumePath =
      files?.["resume"]?.[0]?.path || null;



    const profileImagePath =
      files?.["profileImage"]?.[0]?.path || null;




    let parsedSkills:any[] = [];


    try {

      parsedSkills =
        skills
        ? JSON.parse(skills)
        : [];

    }
    catch {

      parsedSkills = [];

    }






    const application =
      await prisma.application.create({

        data:{


          firstName,


          lastName,


          email,


          phone,


          age:Number(age),



          employmentType,



          companyName:
            companyName || null,



          experience:
            Number(experience || 0),



          skills:
            parsedSkills,



          portfolioUrl:
            portfolioUrl || null,



          resume:
            resumePath,



          profileImage:
            profileImagePath


        }

      });






    return res.status(201).json({

      success:true,

      message:
        "Application submitted successfully",

      data:application

    });




  }
  catch(error:any){


    console.log(
      "CREATE APPLICATION ERROR:",
      error
    );



    // Duplicate Email

    if(error.code === "P2002"){


      return res.status(400).json({

        success:false,

        message:
          "Email already submitted"

      });


    }




    return res.status(500).json({

      success:false,

      message:
        "Failed to create application",

      error:
        error.message

    });



  }


};






// Get All Applications

export const getApplications = async (
  req:Request,
  res:Response
)=>{


  try {


    const applications =
      await prisma.application.findMany({

        orderBy:{

          createdAt:"desc"

        }

      });



    return res.status(200).json({

      success:true,

      data:applications

    });



  }
  catch(error:any){


    return res.status(500).json({

      success:false,

      message:
        "Failed to fetch applications",

      error:
        error.message

    });


  }


};







// Get Single Application

export const getApplicationById = async (
  req:Request,
  res:Response
)=>{


  try {


    const id =
      Number(req.params.id);



    const application =
      await prisma.application.findUnique({

        where:{
          id
        }

      });



    if(!application){


      return res.status(404).json({

        success:false,

        message:
          "Application not found"

      });


    }




    return res.status(200).json({

      success:true,

      data:application

    });



  }
  catch(error:any){


    return res.status(500).json({

      success:false,

      message:
        "Failed to fetch application",

      error:
        error.message

    });


  }


};








// Update Application

export const updateApplication = async (
  req:Request,
  res:Response
)=>{


  try {


    const id =
      Number(req.params.id);



    const application =
      await prisma.application.update({

        where:{
          id
        },

        data:req.body

      });




    return res.status(200).json({

      success:true,

      message:
        "Application updated",

      data:application

    });



  }
  catch(error:any){


    return res.status(500).json({

      success:false,

      message:
        "Update failed",

      error:
        error.message

    });


  }


};









// Delete Application

export const deleteApplication = async (
  req:Request,
  res:Response
)=>{


  try {


    const id =
      Number(req.params.id);



    await prisma.application.delete({

      where:{
        id
      }

    });




    return res.status(200).json({

      success:true,

      message:
        "Application deleted"

    });



  }
  catch(error:any){


    return res.status(500).json({

      success:false,

      message:
        "Delete failed",

      error:
        error.message

    });


  }


};