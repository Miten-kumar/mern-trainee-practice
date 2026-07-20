import { Request, Response } from "express";

import { prisma } from "../config/prisma.js";


// GET ALL USERS

export const getUsers = async(
 req:Request,
 res:Response
)=>{

 try{

   const users =
    await prisma.user.findMany({

      select:{
        id:true,
        name:true,
        email:true,
        createdAt:true
      }

    });


   return res.status(200).json(users);


 }catch(error){

   return res.status(500).json({

     message:"Internal server error"

   });

 }

};




// GET SINGLE USER

export const getUserById = async(
 req:Request,
 res:Response
)=>{


 try{


 const id =
 Number(req.params.id);



 if(isNaN(id)){

  return res.status(400).json({

    message:"Invalid user id"

  });

 }



 const user =
 await prisma.user.findUnique({

  where:{
    id
  }

 });



 if(!user){

  return res.status(404).json({

    message:"User not found"

  });

 }



 return res.status(200).json(user);



 }catch(error){

 return res.status(500).json({

 message:"Internal server error"

 });

 }


};






// CREATE USER

export const createUser = async(
req:Request,
res:Response
)=>{


try{


const {
 name,
 email
}=req.body;



if(!name || !email){

 return res.status(400).json({

 message:"Name and email are required"

 });

}


// Default password because frontend only sends name and email
const password = "default123";



const user =
await prisma.user.create({

data:{
 name,
 email,
 password
}

});



return res.status(201).json({

 id:user.id,
 name:user.name,
 email:user.email,
 createdAt:user.createdAt

});



}catch(error:any){


if(error.code === "P2002"){

 return res.status(400).json({

  message:"Email already exists"

 });

}



return res.status(500).json({

message:"Internal server error"

});


}


};







// UPDATE USER


export const updateUser = async(
req:Request,
res:Response
)=>{


try{


const id =
Number(req.params.id);



const {
 name,
 email
}=req.body;



const user =
await prisma.user.update({

where:{
 id
},

data:{
 name,
 email
}

});



return res.status(200).json({

 id:user.id,
 name:user.name,
 email:user.email,
 createdAt:user.createdAt

});



}catch(error){


return res.status(404).json({

message:"User not found"

});


}


};








// DELETE USER


export const deleteUser = async(
req:Request,
res:Response
)=>{


try{


const id =
Number(req.params.id);



await prisma.user.delete({

where:{
 id
}

});



return res.status(200).json({

message:"User deleted successfully"

});



}catch(error){


return res.status(404).json({

message:"User not found"

});


}


};