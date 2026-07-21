import multer from "multer";
import path from "path";


const storage = multer.diskStorage({

  destination: (
    req,
    file,
    cb
  ) => {

    cb(
      null,
      "uploads/"
    );

  },


  filename: (
    req,
    file,
    cb
  ) => {

    const fileName =
      Date.now() +
      "-" +
      file.originalname;


    cb(
      null,
      fileName
    );

  }

});


const fileFilter = (

  req: any,

  file: Express.Multer.File,

  cb: multer.FileFilterCallback

) => {


  const allowedTypes = [

    "application/pdf",

    "image/jpeg",

    "image/png",

    "image/jpg"

  ];


  if(
    allowedTypes.includes(
      file.mimetype
    )
  ){

    cb(
      null,
      true
    );

  }
  else{

    cb(
      new Error(
        "Only PDF, JPG, JPEG and PNG files are allowed"
      )
    );

  }

};



const upload = multer({

  storage,

  limits: {

    fileSize:
      5 * 1024 * 1024

  },

  fileFilter

});


export default upload;