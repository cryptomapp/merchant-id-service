import Irys from "@irys/sdk";
import { config } from "../config";

export const getIrys = async () => {
  const irys = new Irys({
    url: config.irysUrl,
    token: "solana",
    // key: config.solPrivateKey,
    key: "4GVrk3J7GB8a29RqqBG6x9WZieDufp3ngPc6zcRH3JzfQN3WxLjMbgf98feTWdivSoXxM5EqpQQtzZzrAG6qJDMs",
    config: { providerUrl: config.solanaProviderUrl },
  });
  return irys;
};
