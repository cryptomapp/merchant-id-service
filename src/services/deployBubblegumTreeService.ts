import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { config } from "../config";
import bs58 from "bs58";

export const deployBubblegumTreeService = async (
  maxDepth: number,
  maxBufferSize: number
): Promise<string> => {
  const umi = createUmi(config.solanaProviderUrl);
  const secretKeyUint8Array = bs58.decode(config.solPrivateKey!);
  const signer = umi.eddsa.createKeypairFromSecretKey(secretKeyUint8Array);
  umi.use(keypairIdentity(signer));

  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth,
    maxBufferSize,
  });
  await builder.sendAndConfirm(umi);

  return merkleTree.publicKey.toString();
};
