import { Request, Response } from "express";
import { CryptoMappClient } from "../../utils/cryptoMappClient";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const cryptoMappClient = CryptoMappClient.getInstance();
    const response = await cryptoMappClient.fetchUsers();

    res.status(200).json({
      response,
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

export const getMerchants = async (req: Request, res: Response) => {
  try {
    const cryptoMappClient = CryptoMappClient.getInstance();
    const response = await cryptoMappClient.fetchMerchants();

    res.status(200).json({
      response,
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
