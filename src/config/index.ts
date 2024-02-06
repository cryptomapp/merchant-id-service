import dotenv from "dotenv";
dotenv.config();

export const config = {
  irysUrl: "https://devnet.irys.xyz",
  solanaProviderUrl: "https://api.devnet.solana.com",
  solPrivateKey:
    process.env.MERCHANT_ID_ISSUER_DEV ||
    "4GVrk3J7GB8a29RqqBG6x9WZieDufp3ngPc6zcRH3JzfQN3WxLjMbgf98feTWdivSoXxM5EqpQQtzZzrAG6qJDMs",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/merchants",
};
