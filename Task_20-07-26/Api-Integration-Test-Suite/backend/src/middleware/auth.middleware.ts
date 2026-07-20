import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


const JWT_SECRET =
  process.env.JWT_SECRET || "secret_key";


// Extend Express Request type
declare global {
  namespace Express {

    interface Request {

      user?: {
        id: number;
        email: string;
      };

    }

  }
}


// JWT Authentication Middleware

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const authHeader =
      req.headers.authorization;


    if (!authHeader) {

      return res.status(401).json({

        message: "Authorization token required"

      });

    }



    const token =
      authHeader.split(" ")[1];


    if (!token) {

      return res.status(401).json({

        message: "Invalid token format"

      });

    }



    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      ) as {
        id:number;
        email:string;
      };



    req.user = decoded;



    next();



  } catch(error) {


    return res.status(401).json({

      message:"Invalid or expired token"

    });


  }

};