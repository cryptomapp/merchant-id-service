// deployBubblegumTree.ts

import express from "express";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { config } from "../config";
import bs58 from "bs58";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Received request at /deployBubblegumTree");

  try {
    const umi = createUmi(config.solanaProviderUrl);

    // Decode the private key and create a signer
    const secretKeyUint8Array = bs58.decode(config.solPrivateKey);
    const signer = umi.eddsa.createKeypairFromSecretKey(secretKeyUint8Array);
    umi.use(keypairIdentity(signer));

    const merkleTree = generateSigner(umi);
    const maxDepth = 20; // TODO: Change to 20
    const maxBufferSize = 64; // Example size, adjust as needed

    const builder = await createTree(umi, {
      merkleTree,
      maxDepth,
      maxBufferSize,
    });

    await builder.sendAndConfirm(umi);

    res.status(200).json({
      message: "Bubblegum Tree successfully deployed",
      merkleTreeAddress: merkleTree.publicKey.toString(),
    });
  } catch (error) {
    console.error("Error deploying Bubblegum Tree:", error);
    res.status(500).json({ error: "Failed to deploy Bubblegum Tree" });
  }
});

export default router;
