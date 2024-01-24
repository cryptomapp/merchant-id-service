import { keypairIdentity, none, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { config } from "../config";
import bs58 from "bs58";
import {
  parseLeafFromMintV1Transaction,
  findLeafAssetIdPda,
  mintV1,
} from "@metaplex-foundation/mpl-bubblegum";

export async function mintNFT(
  metadataUri: string,
  id: number,
  merkleTreeAddress: string,
  leafOwnerPublicKeyStr: string
): Promise<any> {
  try {
    const umi = createUmi(config.solanaProviderUrl);

    const creatorSecretKeyUint8Array = bs58.decode(config.solPrivateKey);
    const creatorSigner = umi.eddsa.createKeypairFromSecretKey(
      creatorSecretKeyUint8Array
    );
    umi.use(keypairIdentity(creatorSigner));

    const merkleTreePublicKey = publicKey(merkleTreeAddress);
    const leafOwnerPublicKey = publicKey(leafOwnerPublicKeyStr);

    console.log("Minting NFT...");
    const { signature } = await mintV1(umi, {
      leafOwner: leafOwnerPublicKey,
      merkleTree: merkleTreePublicKey,
      metadata: {
        name: `MerchantID #${id}`,
        uri: metadataUri,
        sellerFeeBasisPoints: 10000,
        collection: none(),
        creators: [
          { address: creatorSigner.publicKey, verified: true, share: 100 },
        ],
      },
    }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

    console.log("NFT Minted. Signature: ", signature);

    try {
      console.log("Parsing leaf from mint transaction...");
      const leaf = await parseLeafFromMintV1Transaction(umi, signature);
      console.log("Leaf: ", leaf);

      console.log("Finding asset ID...");
      const assetId = findLeafAssetIdPda(umi, {
        merkleTree: merkleTreePublicKey,
        leafIndex: leaf.nonce,
      });
      console.log("Asset ID: ", assetId);

      return { signature, leaf, assetId };
    } catch (parseError) {
      console.error("Error parsing leaf or finding asset ID: ", parseError);
      throw parseError;
    }
  } catch (error) {
    console.error("Error minting NFT: ", error);
    throw error;
  }
}
