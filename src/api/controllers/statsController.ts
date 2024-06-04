import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      users: "ok",
    });
  } catch (error) {
    // Type assertion to Error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    res.status(500).json({
      error: errorMessage,
    });
  }
};
