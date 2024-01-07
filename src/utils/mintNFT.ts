import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Keypair } from "@solana/web3.js";

async function mintNFT(metadataUri: string, authority: Keypair): Promise<any> {
  const umi = createUmi("https://api.devnet.solana.com");

  const mint = generateSigner(umi);
  await createNft(umi, {
    mint,
    name: "MerchantID #1",
    symbol: "MAP_ID",
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(25),
  }).sendAndConfirm(umi);
}

export default mintNFT;
