import fs from "fs";
import { getIrys } from "./irysService";
import { isValidMerchantData } from "../utils/validation";
import { Merchant, MerchantData } from "../models/merchant";
import { prepareMetadata } from "../utils/prepareMetadata";
import { mintNFT } from "./nftService";
import { getMerchantCounter } from "../utils/cryptoMappClient";

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

  const irys = await getIrys();
  const imageData = fs.readFileSync(imageFile.path);
  const imageReceipt = await irys.upload(imageData);
  const imageUrl = `https://gateway.irys.xyz/${imageReceipt.id}`;

  const id = await getMerchantCounter();
  const metadata = await prepareMetadata(merchantData, imageUrl, id);
  const metadataReceipt = await irys.upload(JSON.stringify(metadata));
  const metadataUri = `https://gateway.irys.xyz/${metadataReceipt.id}`;

  fs.unlinkSync(imageFile.path);

  const merkleTreeAddress = process.env.MERKLE_TREE_ADDRESS || "";
  const mintResult = await mintNFT(
    metadataUri,
    id,
    merkleTreeAddress,
    merchantData.owner
  );

  const newMerchant = new Merchant({
    ...merchantData,
    image: imageUrl,
  });
  await newMerchant.save();

  return {
    imageDataId: imageReceipt.id,
    metadataUri: metadataUri,
    merchantId: id,
    mintResult: mintResult,
  };
};
