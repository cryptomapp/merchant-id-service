import { keypairIdentity, none, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { config } from "../config";
import bs58 from "bs58";
import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";

export async function mintNFT(
  metadataUri: string,
  id: number,
  merkleTreeAddress: string,
  leafOwnerPublicKeyStr: string
): Promise<any> {
  const umi = createUmi(config.solanaProviderUrl);

  // Decode the Base58 private key for the creator (your wallet)
  const creatorSecretKeyUint8Array = bs58.decode(config.solPrivateKey);
  const creatorSigner = umi.eddsa.createKeypairFromSecretKey(
    creatorSecretKeyUint8Array
  );
  umi.use(keypairIdentity(creatorSigner));

  // Convert the Merkle Tree address from string to PublicKey
  const merkleTreePublicKey = publicKey(merkleTreeAddress);

  // Convert the leaf owner's public key from string to PublicKey
  const leafOwnerPublicKey = publicKey(leafOwnerPublicKeyStr);

  // Mint the cNFT for the specified leaf owner
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

  return signature;
}
