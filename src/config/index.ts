import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";
dotenv.config();

function createBase58Keypair(
  secretArrayStr: string | undefined
): string | undefined {
  if (!secretArrayStr) return undefined;
  const secretArray = JSON.parse(secretArrayStr);
  const secretUint8Array = Uint8Array.from(secretArray);
  const keypair = Keypair.fromSecretKey(secretUint8Array);
  return bs58.encode(keypair.secretKey);
}

export const config = {
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || "https://cryptomapp.vercel.app",

  mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/merchants",

  irysUrl: process.env.IRYS_URL || "https://devnet.irys.xyz",

  solanaProviderUrl:
    process.env.SOLANA_PROVIDER_URL || "https://api.devnet.solana.com",
  solPrivateKey: createBase58Keypair(process.env.SERVICE_WALLET),

  bubblegumTreeAddress:
    process.env.MERKLE_TREE_ADDRESS ||
    "CdpanipvRBte9gEAhxryXhGCMkv6fY5R1Z8qvgqaJP5F",
  stateAddress: process.env.STATE_ADDRESS || "",

  openAiApiKey: process.env.OPENAI_API_KEY || "",
};
