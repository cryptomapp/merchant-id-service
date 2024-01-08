import {
  createV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { config } from "../config"; // Importing config
import bs58 from "bs58"; // Base58 for decoding

async function mintNFT(metadataUri: string): Promise<any> {
  const umi = createUmi(config.solanaProviderUrl);

  // Decode the Base58 private key
  const secretKeyUint8Array = bs58.decode(config.solPrivateKey);

  // Create Keypair and Signer from secret key
  const myKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyUint8Array);
  const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);
  umi.use(keypairIdentity(myKeypairSigner));

  const mint = generateSigner(umi);
  await createV1(umi, {
    mint,
    authority: myKeypairSigner,
    name: "MerchantID #1", // TODO: Handle fetching id from Solana program
    symbol: "MAP_ID",
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(25),
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi);
}

export default mintNFT;
