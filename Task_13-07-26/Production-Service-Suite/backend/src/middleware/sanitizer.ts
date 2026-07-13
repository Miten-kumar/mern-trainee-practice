import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  sanitizeObject
} from "../security/xss";


export function sanitizeInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {


  // Sanitize request body
  if (req.body) {

    req.body =
      sanitizeObject(req.body) as typeof req.body;

  }



  // Express 5 req.query is readonly
  // so don't modify req.query



  // Sanitize URL params
  if (req.params) {

    Object.keys(req.params)
      .forEach((key)=>{

        req.params[key] =
          sanitizeObject(
            req.params[key]
          ) as string;

      });

  }


  next();

}