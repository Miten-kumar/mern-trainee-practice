import multer from "multer";
import path from "path";
import fs from "fs";



const uploadPath = path.join(
  process.cwd(),
  "uploads"
);



// Create uploads folder if not exists

if (!fs.existsSync(uploadPath)) {

  fs.mkdirSync(
    uploadPath,
    {
      recursive: true
    }
  );

}




const storage = multer.diskStorage({


  destination: (
    req,
    file,
    cb
  ) => {


    cb(
      null,
      uploadPath
    );


  },



  filename: (
    req,
    file,
    cb
  ) => {


    const fileName =
      Date.now()
      +
      "-"
      +
      file.originalname.replace(/\s+/g, "-");


    cb(
      null,
      fileName
    );


  }


});






const fileFilter = (

  req:any,

  file:Express.Multer.File,

  cb:multer.FileFilterCallback

)=>{


  const allowedTypes = [

    "application/pdf",

    "image/png",

    "image/jpeg"

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
        "Only PDF, PNG and JPG files allowed"
      )
    );

  }


};







const upload = multer({

  storage,


  limits:{

    fileSize:
      5 * 1024 * 1024

  },


  fileFilter


});



export default upload;