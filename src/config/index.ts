import dotenv from "dotenv";
dotenv.config();

export const config = {
  frontendUrl: process.env.FRONTEND_URL || "https://cryptomapp.vercel.app",
  irysUrl: process.env.IRYS_URL || "https://devnet.irys.xyz",
  solanaProviderUrl:
    process.env.SOLANA_PROVIDER_URL || "https://api.devnet.solana.com",
  solPrivateKey:
    process.env.SERVICE_WALLET ||
    "4GVrk3J7GB8a29RqqBG6x9WZieDufp3ngPc6zcRH3JzfQN3WxLjMbgf98feTWdivSoXxM5EqpQQtzZzrAG6qJDMs",
  bubblegumTreeAddress:
    process.env.MERKLE_TREE_ADDRESS ||
    "CdpanipvRBte9gEAhxryXhGCMkv6fY5R1Z8qvgqaJP5F",
  mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/merchants",
  port: process.env.PORT || 3000,
  stateAddress:
    process.env.STATE_ADDRESS || "5HzkGM1XFoVrrPLjanQ7Le1Aa4iHPf3aivfKLUztmwFn",
  openAiApiKey:
    process.env.OPENAI_API_KEY ||
    "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",
};
