import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Here you can add more logic to handle different types of errors differently
  // For example, you might want to handle certain custom errors with specific status codes

  res.status(500).json({
    message: err.message || "An unexpected error occurred",
  });
};
