import express from "express";
import { getIrys } from "../irys/irysService";
import fs from "fs";
import multer from "multer";
import path from "path";
import { isValidMerchantData } from "../utils/validation";
import { MerchantData, MerchantMetadata } from "../models/merchant";

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Use Date.now() to name the file uniquely
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  console.log("Received request at /uploadFile");

  try {
    // Extract MerchantData and image file from the request
    const merchantData: MerchantData = JSON.parse(req.body.data);
    const imageFile = req.file;

    if (!isValidMerchantData(merchantData)) {
      throw new Error("Invalid merchant data provided.");
    }

    if (!imageFile) {
      throw new Error("No image provided.");
    }

    const irys = await getIrys();

    // Upload image to Irys and receive a URL
    const imageData = fs.readFileSync(imageFile.path);
    const imageReceipt = await irys.upload(imageData);
    const imageUrl = `https://gateway.irys.xyz/${imageReceipt.id}`;

    // Combine image URL with merchant data for full metadata
    const metadata: MerchantMetadata = { ...merchantData, imageUrl };
    const metadataReceipt = await irys.upload(JSON.stringify(metadata));

    // Delete the image from the server after upload
    fs.unlinkSync(imageFile.path);

    res.status(200).json({
      message: "File and metadata uploaded successfully",
      imageDataId: imageReceipt.id,
      metadataId: metadataReceipt.id,
    });
  } catch (error) {
    console.error("Error during file upload: ", error);
    // Clean up any residual files in case of an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error uploading file or metadata" });
    }
  }
});

export default router;
