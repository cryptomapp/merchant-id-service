import express from "express";
import { getIrys } from "../irys/irysService";
import fs from "fs";
import multer from "multer";
import path from "path";
import { isValidMerchantData } from "../utils/validation";
import { Merchant, MerchantData } from "../models/merchant";
import { prepareMetadata } from "../utils/prepareMetadata";
import mintNFT from "../utils/mintNFT";

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
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

    // Prepare and upload metadata with merchant data and image URL
    const id = 420; // TODO: Hardcoded id for now - get id from Solana Program

    const metadata = await prepareMetadata(merchantData, imageUrl, id);
    const metadataReceipt = await irys.upload(JSON.stringify(metadata)); // receipt object

    // Ensure you extract the correct identifier from the receipt object.
    // Assuming it's 'id' here but verify this with your implementation or documentation.
    const metadataId = metadataReceipt.id;
    const metadataUri = `https://gateway.irys.xyz/${metadataId}`;

    // Delete the image from the server after upload
    fs.unlinkSync(imageFile.path);

    // TODO: Refactor it and add to .env and read through config
    const merkleTreeAddress = "2A4sFviaeQnAv8Xx7DYQCWEWwizQMCGB9KtWKyCQBj4M";

    // Mint NFT with the metadata URI
    await mintNFT(metadataUri, id, merkleTreeAddress, merchantData.owner);

    // Create a new merchant document from the provided data and save it to MongoDB
    const newMerchant = new Merchant({
      ...merchantData,
      image: imageUrl,
    });

    await newMerchant.save();

    res.status(200).json({
      message:
        "File, metadata uploaded, NFT minted, and merchant data saved successfully",
      imageDataId: imageReceipt.id,
      metadataUri: metadataUri,
      merchantId: id, // Including the merchant id in the response
    });
  } catch (error) {
    console.error("Error during file upload or minting: ", error);
    // Clean up any residual files in case of an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error uploading file or metadata or minting NFT",
    });
  }
});

export default router;
