import { Request, Response, NextFunction } from "express";


const sqlPatterns = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /(union\s+select)/i,
  /(select\s+.*from)/i,
  /(insert\s+into)/i,
  /(delete\s+from)/i,
  /(drop\s+table)/i,
  /(update\s+.*set)/i,
  /(or\s+1\s*=\s*1)/i
];


function containsSQLInjection(
  value: unknown
): boolean {

  if (typeof value === "string") {

    return sqlPatterns.some(
      pattern => pattern.test(value)
    );

  }


  if (typeof value === "object" && value !== null) {

    return Object.values(value)
      .some(item => containsSQLInjection(item));

  }


  return false;

}



export function sqlInjectionGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {


  if (
    containsSQLInjection(req.body)
  ) {

    return res.status(400).json({

      success:false,

      message:
        "Potential SQL injection detected."

    });

  }


  next();

}