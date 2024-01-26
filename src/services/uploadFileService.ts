import fs from "fs";
import { getIrys } from "./irysService";
import { isValidMerchantData } from "../utils/validation";
import { Merchant, MerchantData } from "../models/merchant";
import { prepareMetadata } from "../utils/prepareMetadata";
import { mintNFT } from "./nftService";

import { ProgramState } from "../generated/accounts/ProgramState";
import { PROGRAM_ID } from "../generated";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const getMerchantCounter = async (): Promise<number> => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  console.log("PROGRAM_ID: ", PROGRAM_ID);
  const programStatePubkey = new PublicKey(
    "2tCrjJpmHHHbDg62wsWTGt3warf7g6zVFppjvyhRrKLf"
  );
  const accountInfo = await connection.getAccountInfo(programStatePubkey);

  if (!accountInfo || !accountInfo.data) {
    throw new Error("ProgramState account not found or has no data");
  }

  // Check if Solita SDK provides a decode method for ProgramState
  // Assuming 'decode' is the method provided by Solita for decoding
  // Replace 'decode' with the actual method name if different
  const programState = ProgramState.deserialize(accountInfo.data)[0];

  const merchantCounter = programState.merchantCounter;
  const daoPubkey = programState.daoPubkey;
  const reviewWalletKey = programState.reviewWalletPubkey;

  console.log("MerchantCounter: ", merchantCounter);
  console.log("DaoPubkey: ", daoPubkey);
  console.log("ReviewWalletKey: ", reviewWalletKey);

  return merchantCounter;
};

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

  console.log("b4");
  getMerchantCounter();
  console.log("after");

  const id = 421; // TODO: Replace with actual logic to generate id
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
