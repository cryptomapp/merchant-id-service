import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { ProgramState } from "../generated/accounts/ProgramState";
import { createInitializeMerchantInstruction } from "../generated/instructions/initializeMerchant";
import { CnftIdentifier, PROGRAM_ID } from "../generated";
import fs from "fs";

export class CryptoMappClient {
  private static instance: CryptoMappClient;
  private connection: Connection;
  private programId: PublicKey;
  private stateAddress: PublicKey;
  private serviceWallet: Keypair;

  private constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    this.programId = new PublicKey(PROGRAM_ID);
    this.serviceWallet = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs.readFileSync(
            process.env.WALLET_FILE_PATH ||
              "/Users/twentone37/my-solana-wallet.json",
            "utf-8"
          )
        )
      )
    );
    this.stateAddress = new PublicKey(
      "9Zxs8fDSskUJ5S1vEsFe9eraz3f1NsQ83BKpwQvqNHw1"
    );
  }

  public static getInstance(): CryptoMappClient {
    if (!CryptoMappClient.instance) {
      CryptoMappClient.instance = new CryptoMappClient();
    }
    return CryptoMappClient.instance;
  }

  public async getMerchantCounter(): Promise<number> {
    const accountInfo = await this.connection.getAccountInfo(this.stateAddress);

    if (!accountInfo || !accountInfo.data) {
      throw new Error("ProgramState account not found or has no data"); // todo: error from commons
    }
    const programState = ProgramState.deserialize(accountInfo.data)[0];

    return programState.merchantCounter;
  }

  public async callInitializeMerchant(
    userPublicKeyString: string,
    nftIdentifierArray: [string, number]
  ): Promise<string> {
    console.log(
      "callInitializeMerchant - userPublicKeyString: ",
      userPublicKeyString
    );
    const userPublicKey = new PublicKey(userPublicKeyString);
    // Calculate the PDA for the user account
    const [userPda] = await calculatePDA(this.programId, userPublicKey, "user");
    console.log("userPda: ", userPda.toBase58());

    // Calculate the PDA for the merchant account
    const [merchantPda] = await calculatePDA(
      this.programId,
      userPublicKey,
      "merchant"
    );

    console.log("Before createInitializeMerchantInstruction");
    console.log("merchantPda: ", merchantPda?.toBase58());
    console.log("userPda: ", userPda?.toBase58());
    console.log("userPublicKey: ", userPublicKey?.toBase58());
    console.log("stateAddress: ", this.stateAddress?.toBase58());
    console.log("nftIdentifier: ", nftIdentifierArray);

    const nftIdentifier: CnftIdentifier = {
      merkleTreeAddress: new PublicKey(nftIdentifierArray[0]),
      leafIndex: nftIdentifierArray[1],
    };

    const instruction = createInitializeMerchantInstruction(
      {
        merchantAccount: merchantPda,
        userAccount: userPda,
        userPubkey: userPublicKey,
        serviceWallet: this.serviceWallet.publicKey,
        state: this.stateAddress,
        systemProgram: SystemProgram.programId,
      },
      {
        nftIdentifier: nftIdentifier,
      }
    );

    console.log("after instruction");

    const transaction = new Transaction().add(instruction);
    console.log("after transaction");

    // Fetch a recent blockhash
    const recentBlockhash = await this.connection.getRecentBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;

    transaction.sign(this.serviceWallet);
    console.log("after sign");

    const serializedTransaction = transaction.serialize();
    console.log("after serialize");

    const signature = await this.connection.sendRawTransaction(
      serializedTransaction
    );
    console.log("after sendRawTransaction");

    await this.connection.confirmTransaction(signature, "confirmed");
    return signature;
  }
}

async function calculatePDA(
  programId: PublicKey,
  accountPubkey: PublicKey,
  seedPrefix: string
): Promise<[PublicKey, number]> {
  const seeds = seedPrefix
    ? [Buffer.from(seedPrefix), accountPubkey.toBuffer()]
    : [accountPubkey.toBuffer()];
  return PublicKey.findProgramAddressSync(seeds, programId);
}
