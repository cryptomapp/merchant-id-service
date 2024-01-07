// src/routes/uploadFile.ts
import express from "express";
import { getIrys } from "../irys/irysService";
import fs from "fs";
import multer from "multer";
import { isValidMerchantData } from "../utils/validation";

const router = express.Router();

// Configure multer for image upload
const upload = multer({ dest: "uploads/" }); // You might want a more permanent storage solution

router.post("/", upload.single("image"), async (req, res) => {
  // Extract MerchantData and image file from the request
  const merchantData: MerchantData = JSON.parse(req.body.data); // Assume JSON data is sent as a stringified field
  const imageFile = req.file;

  if (!isValidMerchantData(merchantData) || !imageFile) {
    return res
      .status(400)
      .json({ error: "Invalid merchant data or no image provided" });
  }

  try {
    const irys = await getIrys();

    // Upload image to Irys and receive a URL
    const imageData = fs.readFileSync(imageFile.path);
    const imageReceipt = await irys.upload(imageData);
    const imageUrl = `https://gateway.irys.xyz/${imageReceipt.id}`;

    // Combine image URL with merchant data for full metadata
    const metadata: MerchantMetadata = { ...merchantData, imageUrl };
    const metadataReceipt = await irys.upload(JSON.stringify(metadata));

    res.status(200).json({
      message: "File and metadata uploaded successfully",
      imageDataId: imageReceipt.id,
      metadataId: metadataReceipt.id,
    });
  } catch (error) {
    console.error("Error uploading file or metadata: ", error);
    res.status(500).json({ error: "Error uploading file or metadata" });
  }
});

export default router;
