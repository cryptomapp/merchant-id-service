import {
  Umi,
  keypairIdentity,
  none,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { config } from "../config";
import bs58 from "bs58";
import {
  LeafSchema,
  findLeafAssetIdPda,
  mintV1,
  parseLeafFromMintV1Transaction,
} from "@metaplex-foundation/mpl-bubblegum";

async function ensureTransactionConfirmed(umi: Umi, signature: Uint8Array) {
  let confirmed = false;
  const maxAttempts = 10;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const transaction = await umi.rpc.getTransaction(signature, {
        commitment: "finalized",
      });
      if (transaction) {
        confirmed = true;
        break;
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  if (!confirmed) {
    throw new Error("Transaction not confirmed after maximum attempts");
  }
}

export async function mintNFT(
  metadataUri: string,
  id: number,
  merkleTreeAddress: string,
  leafOwnerPublicKeyStr: string
): Promise<[string, number]> {
  const umi = createUmi(config.solanaProviderUrl);

  console.log("mintNFT - id: ", id);

  // Decode the Base58 private key for the creator (your wallet)
  const creatorSecretKeyUint8Array = bs58.decode(config.solPrivateKey!);
  const creatorSigner = umi.eddsa.createKeypairFromSecretKey(
    creatorSecretKeyUint8Array
  );
  umi.use(keypairIdentity(creatorSigner));

  // Convert the Merkle Tree address from string to PublicKey
  const merkleTreePublicKey = publicKey(merkleTreeAddress);

  console.log("created merkleTreePublicKey");
  // Convert the leaf owner's public key from string to PublicKey
  const leafOwnerPublicKey = publicKey(leafOwnerPublicKeyStr);

  console.log("created leafOwnerPublicKey");

  const builder = transactionBuilder().add(
    setComputeUnitLimit(umi, { units: 10_000 })
  );

  // Mint the cNFT for the specified leaf owner
  const signature = builder
    .add(
      mintV1(umi, {
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
      })
    )
    .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

  console.log("minted cNFT");

  await ensureTransactionConfirmed(umi, (await signature).signature);

  console.log("confirmed transaction");

  try {
    const leaf: LeafSchema = await parseLeafFromMintV1Transaction(
      umi,
      (
        await signature
      ).signature
    );
    const assetIdPda = findLeafAssetIdPda(umi, {
      merkleTree: merkleTreePublicKey,
      leafIndex: BigInt(leaf.nonce),
    });

    // Serialize both BigInt values to strings for logging or JSON serialization
    const assetId: [string, number] = [assetIdPda[0].toString(), assetIdPda[1]];

    return assetId;
  } catch (error) {
    console.error("Error parsing leaf from mint transaction:", error);
    throw error;
  }
}
function setComputeUnitLimit(
  umi: Umi,
  arg1: { units: number }
): import("@metaplex-foundation/umi").TransactionBuilderItemsInput {
  throw new Error("Function not implemented.");
}
