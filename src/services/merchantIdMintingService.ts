import fs from "fs";
import { getIrys } from "./irysService";
import { isValidMerchantData } from "../utils/validation";
import { Merchant, MerchantData } from "../models/merchant";
import { prepareMetadata } from "../utils/prepareMetadata";
import { mintNFT } from "./nftService";
import { CryptoMappClient } from "../utils/cryptoMappClient";
import { generateCategoriesFromDescription } from "./openAiService";
import { config } from "../config";
import { PublicKey } from "@solana/web3.js";

export const mintMerchantIdAndStoreInMongo = async (
  merchantData: MerchantData,
  imageFile: Express.Multer.File
) => {
  try {
    if (!isValidMerchantData(merchantData)) {
      throw new Error("Invalid merchant data provided.");
    }

    console.log("start process");
    // Generate categories based on the merchant's description
    let categories = [];
    try {
      categories = await generateCategoriesFromDescription(
        merchantData.description
      );
    } catch (categoryError) {
      if (categoryError instanceof Error) {
        throw new Error("Error generating categories.");
      } else {
        throw new Error("Unknown error generating categories.");
      }
    }

    console.log("generated category: ", categories);

    // Upload image to Arweave with Irys SDK
    const irys = await getIrys();
    const imageData = fs.readFileSync(imageFile.path);
    let imageUrl = "";

    try {
      const imageReceipt = await irys.upload(imageData);
      imageUrl = `https://gateway.irys.xyz/${imageReceipt.id}`;
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        throw new Error("Error uploading to Arweave.");
      } else {
        throw new Error("Unknown error uploading to Arweave.");
      }
    }

    console.log("stored image");

    // Prepare and upload metadata
    const cryptoMappClient = CryptoMappClient.getInstance();
    const id = await cryptoMappClient.getMerchantCounter();

    let metadataUri = "";
    try {
      const metadataWithCategories = { ...merchantData, categories };
      const metadata = await prepareMetadata(
        metadataWithCategories,
        imageUrl,
        id
      );
      const metadataReceipt = await irys.upload(JSON.stringify(metadata));
      metadataUri = `https://gateway.irys.xyz/${metadataReceipt.id}`;
    } catch (metadataError) {
      if (metadataError instanceof Error) {
        throw new Error("Error uploading to Arweave.");
      } else {
        throw new Error("Unknown error uploading to Arweave.");
      }
    }

    console.log("stored metadata");

    // Mint NFT
    let mintResult: [string, number];
    try {
      const cryptoMappClient = CryptoMappClient.getInstance();
      const id = await cryptoMappClient.getMerchantCounter();
      const merkleTreeAddress = config.bubblegumTreeAddress;
      mintResult = await mintNFT(
        metadataUri,
        id,
        merkleTreeAddress,
        merchantData.owner
      );
    } catch (mintError) {
      if (mintError instanceof Error) {
        throw new Error("Error minting NFT.");
      } else {
        throw new Error("Unknown error during NFT minting.");
      }
    }

    console.log("minted nft");

    console.log("merchantData: ", merchantData);

    // Save merchant data to Mongo
    try {
      const newMerchant = new Merchant({
        ...merchantData,
        image: imageUrl,
        categories,
      });
      await newMerchant.save();
    } catch (mongoError) {
      if (mongoError instanceof Error) {
        throw new Error("Error uploading to Mongo.");
      } else {
        throw new Error("Unknown error uploading to Mongo.");
      }
    }

    const referrer = await cryptoMappClient.getReferrerPublicKey(
      new PublicKey(merchantData.owner)
    );

    if (referrer == null) {
      await cryptoMappClient.callInitializeMerchant(
        merchantData.owner,
        mintResult
      );
    } else {
      const referrerPublicKeyString = referrer.toString();
      await cryptoMappClient.callInitializeMerchantWithReferrer(
        merchantData.owner,
        referrerPublicKeyString,
        mintResult
      );
    }

    return {
      imageUrl,
      metadataUri,
      mintResult,
    };
  } catch (error) {
    throw error;
  } finally {
    // Clean up: delete temporary image file
    if (imageFile) {
      fs.unlinkSync(imageFile.path);
    }
  }
};
