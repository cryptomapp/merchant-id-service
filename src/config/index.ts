import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";
dotenv.config();

const privateKeyArray = [
  177, 102, 230, 198, 255, 225, 138, 175, 77, 20, 173, 246, 207, 55, 229, 116,
  153, 134, 218, 106, 26, 89, 144, 8, 182, 69, 113, 237, 186, 216, 105, 238,
  192, 80, 116, 253, 20, 116, 84, 122, 11, 95, 239, 77, 60, 59, 49, 203, 209,
  227, 9, 233, 68, 50, 9, 79, 142, 94, 90, 216, 197, 202, 217, 180,
];
const secret = new Uint8Array(privateKeyArray);
const keypair = Keypair.fromSecretKey(secret);
const privateKeyTest = bs58.encode(keypair.secretKey);

export const config = {
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || "https://cryptomapp.vercel.app",

  mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/merchants",

  irysUrl: process.env.IRYS_URL || "https://devnet.irys.xyz",

  solanaProviderUrl:
    process.env.SOLANA_PROVIDER_URL || "https://api.devnet.solana.com",
  // solPrivateKey:
  //     process.env.SERVICE_WALLET ||
  //     "4GVrk3J7GB8a29RqqBG6x9WZieDufp3ngPc6zcRH3JzfQN3WxLjMbgf98feTWdivSoXxM5EqpQQtzZzrAG6qJDMs",
  solPrivateKey: privateKeyTest,

  bubblegumTreeAddress:
    process.env.MERKLE_TREE_ADDRESS ||
    "CdpanipvRBte9gEAhxryXhGCMkv6fY5R1Z8qvgqaJP5F",
  stateAddress:
    process.env.STATE_ADDRESS || "DaeZ1fXW21NSfw2dRdySMRD1CCbnR3G5RLwpbod4vz2v",

  openAiApiKey:
    process.env.OPENAI_API_KEY ||
    "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",
};
