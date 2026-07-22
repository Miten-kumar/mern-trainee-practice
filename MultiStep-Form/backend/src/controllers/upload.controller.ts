import { Request, Response } from "express";


// Upload Resume
export const uploadResume = (
  req: Request,
  res: Response
) => {


  try {


    if(!req.file){

      return res.status(400).json({

        success:false,

        message:"Resume file required"

      });

    }



    res.status(200).json({

      success:true,

      message:"Resume uploaded successfully",

      filePath:
        `/uploads/${req.file.filename}`

    });



  } catch(error){


    res.status(500).json({

      success:false,

      message:"Resume upload failed",

      error

    });


  }

};




// Upload Profile Image
export const uploadProfileImage = (
  req: Request,
  res: Response
) => {


  try {


    if(!req.file){

      return res.status(400).json({

        success:false,

        message:"Profile image required"

      });

    }



    res.status(200).json({

      success:true,

      message:"Profile image uploaded successfully",

      filePath:
        `/uploads/${req.file.filename}`

    });



  } catch(error){


    res.status(500).json({

      success:false,

      message:"Image upload failed",

      error

    });


  }

};