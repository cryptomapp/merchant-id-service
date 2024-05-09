import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  let statusCode = 500;
  let errorMessage = "An unexpected error occurred";

  // Handle specific error cases
  if (err instanceof SyntaxError && "body" in err) {
    // Handle JSON parsing errors
    statusCode = 400;
    errorMessage = "Invalid JSON payload";
  } else if (err instanceof multer.MulterError) {
    // Handle Multer file upload errors
    statusCode = 400;
    errorMessage = "File upload error";
  } else if (err.message === "Invalid merchant data provided.") {
    // Handle invalid merchant data error
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.message === "No image provided.") {
    // Handle missing image error
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.message === "Error generating categories.") {
    // Handle error in generating categories
    statusCode = 500;
    errorMessage = "Error generating categories";
  } else if (err.message === "Error uploading to Arweave.") {
    // Handle error in generating categories
    statusCode = 500;
    errorMessage = "Error uploading to Arweave.";
  } else if (err.message === "Error minting NFT") {
    // Handle error in generating categories
    statusCode = 500;
    errorMessage = "Error minting NFT.";
  } else if (err.message === "Error uploading to Mongo") {
    // Handle error in generating categories
    statusCode = 500;
    errorMessage = "Error uploading to Mongo.";
  }

  // Send error response with appropriate status code
  res.status(statusCode).json({
    error: {
      message: errorMessage,
    },
  });
};
