import dotenv from "dotenv";
dotenv.config();

export const config = {
  irysUrl: process.env.IRYS_URL || "https://devnet.irys.xyz",
  solanaProviderUrl:
    process.env.SOLANA_PROVIDER_URL || "https://api.devnet.solana.com",
  solPrivateKey:
    process.env.SERVICE_WALLET ||
    "4GVrk3J7GB8a29RqqBG6x9WZieDufp3ngPc6zcRH3JzfQN3WxLjMbgf98feTWdivSoXxM5EqpQQtzZzrAG6qJDMs",
  bubblegumTreeAddress:
    process.env.MERKLE_TREE_ADDRESS ||
    "CdpanipvRBte9gEAhxryXhGCMkv6fY5R1Z8qvgqaJP5F",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/merchants",
  port: process.env.PORT || 3000,
  openAiApiKey:
    process.env.OPENAI_API_KEY ||
    "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",
};
