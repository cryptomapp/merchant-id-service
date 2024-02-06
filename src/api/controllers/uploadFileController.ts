import { Request, Response } from "express";
import { uploadFileService } from "../../services/uploadFileService";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const merchantData = JSON.parse(req.body.data);
    const imageFile = req.file;

    if (!imageFile) {
      throw new Error("Image file is missing.");
    }

    console.log("Merchant data: ", merchantData);

    const result = await uploadFileService(merchantData, imageFile);

    console.log("result: ", result);

    res.status(200).json({
      message:
        "File, metadata uploaded, NFT minted, and merchant data saved successfully",
      ...result,
    });
  } catch (error) {
    // Type assertion to Error
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error uploading file or metadata or minting NFT";
    console.error("Error during file upload or minting: ", errorMessage);
    res.status(500).json({
      error: errorMessage,
    });
  }
};
