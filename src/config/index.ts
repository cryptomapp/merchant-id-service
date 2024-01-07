import dotenv from "dotenv";
dotenv.config();

export const config = {
  irysUrl: "https://devnet.irys.xyz",
  solanaProviderUrl: "https://api.devnet.solana.com",
  solPrivateKey: process.env.MERCHANT_ID_ISSUER_DEV || "",
};
