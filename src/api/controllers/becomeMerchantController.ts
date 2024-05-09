import { Request, Response } from "express";
import { mintMerchantIdAndStoreInMongo } from "../../services/merchantIdMintingService";

export const beginRegistrationProcess = async (req: Request, res: Response) => {
  try {
    const merchantData = JSON.parse(req.body.data);
    const imageFile = req.file;

    if (!imageFile) {
      throw new Error("Image file is missing.");
    }
    const result = await mintMerchantIdAndStoreInMongo(merchantData, imageFile);

    res.status(200).json({
      message:
        "File & metadata uploaded on Arweave, NFT minted on Solana, and merchant data saved successfully in Mongo",
      ...result,
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
