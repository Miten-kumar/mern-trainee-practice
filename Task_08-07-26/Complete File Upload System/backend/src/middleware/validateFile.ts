import { type Request, type Response, type NextFunction } from "express";

export const validateFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please select at least one file.",
    });
  }

  next();
};