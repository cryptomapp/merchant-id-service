import fs from "fs";
import { getIrys } from "./irysService";
import { isValidMerchantData } from "../utils/validation";
import { Merchant, MerchantData } from "../models/merchant";
import { prepareMetadata } from "../utils/prepareMetadata";
import { mintNFT } from "./nftService";
import { CryptoMappClient } from "../utils/cryptoMappClient";
import { generateCategoriesFromDescription } from "./openAiService";
import { config } from "../config";

export const uploadFileService = async (
  merchantData: MerchantData,
  imageFile: Express.Multer.File
) => {
  if (!isValidMerchantData(merchantData)) {
    throw new Error("Invalid merchant data provided.");
  }
  if (!imageFile) {
    throw new Error("No image provided.");
  }

  console.log("UploadFileService: ", merchantData, imageFile);

  // Generate categories based on the merchant's description
  const categories = await generateCategoriesFromDescription(
    merchantData.description
  );

  console.log("Getting irys...");
  const irys = await getIrys();
  const imageData = fs.readFileSync(imageFile.path);
  console.log("Uploading image...");
  const imageReceipt = await irys.upload(imageData);
  const imageUrl = `https://gateway.irys.xyz/${imageReceipt.id}`;

  console.log("Getting CryptoMappClient...");
  const cryptoMappClient = CryptoMappClient.getInstance();

  console.log("Getting merchant counter...");
  const id = await cryptoMappClient.getMerchantCounter();

  const metadataWithCategories = {
    ...merchantData,
    categories,
    image: imageUrl,
  };
  const metadata = await prepareMetadata(merchantData, imageUrl, id);
  const metadataReceipt = await irys.upload(JSON.stringify(metadata));
  const metadataUri = `https://gateway.irys.xyz/${metadataReceipt.id}`;

  fs.unlinkSync(imageFile.path);

  const merkleTreeAddress = config.bubblegumTreeAddress;
  const mintResult = await mintNFT(
    metadataUri,
    id,
    merkleTreeAddress,
    merchantData.owner
  );

  console.log("Mint result: ", mintResult);

  const newMerchant = new Merchant({
    ...merchantData,
    image: imageUrl,
    categories: [""],
  });

  console.log("halo");

  await newMerchant.save();

  console.log("Saved in Mongo");

  // todo: should handle if user has referrer
  await cryptoMappClient.callInitializeMerchant(merchantData.owner, mintResult);

  return {
    imageDataId: imageReceipt.id,
    metadataUri: metadataUri,
    merchantId: id,
    mintResult: mintResult,
  };
};
