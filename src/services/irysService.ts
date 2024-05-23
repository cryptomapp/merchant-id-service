import Irys from "@irys/sdk";
import { config } from "../config";

export const getIrys = async () => {
  const irys = new Irys({
    network: "mainnet",
    token: "solana",
    key: config.solPrivateKey,
    // config: { providerUrl: config.solanaProviderUrl },
  });

  return irys;
};
