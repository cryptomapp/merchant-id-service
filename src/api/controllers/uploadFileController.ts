import { Request, Response } from "express";
import { uploadFileService } from "../../services/uploadFileService";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const merchantData = JSON.parse(req.body.data);
    const imageFile = req.file;

    if (!imageFile) {
      throw new Error("Image file is missing.");
    }

    const result = await uploadFileService(merchantData, imageFile);

    res.status(200).json({
      message:
        "File, metadata uploaded, NFT minted, and merchant data saved successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error during file upload or minting: ", error);
    res.status(500).json({
      error: error.message || "Error uploading file or metadata or minting NFT",
    });
  }
};
