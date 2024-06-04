import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { ProgramState } from "../generated/accounts/ProgramState";
import { createInitializeMerchantInstruction } from "../generated/instructions/initializeMerchant";
import {
  CnftIdentifier,
  Merchant,
  PROGRAM_ID,
  User,
  createInitializeMerchantWithReferrerInstruction,
} from "../generated";
import bs58 from "bs58";
import { config } from "../config";

export class CryptoMappClient {
  private static instance: CryptoMappClient;
  private connection: Connection;
  private programId: PublicKey;
  private stateAddress: PublicKey;
  private serviceWallet: Keypair;

  calculatePDA(publicKey: PublicKey, seedPrefix: string): [PublicKey, number] {
    const seeds = seedPrefix
      ? [Buffer.from(seedPrefix), publicKey.toBuffer()]
      : [publicKey.toBuffer()];
    return PublicKey.findProgramAddressSync(seeds, this.programId);
  }

  private constructor() {
    this.connection = new Connection(config.solanaProviderUrl, "confirmed");
    this.programId = new PublicKey(PROGRAM_ID);
    const secretKeyUint8Array = bs58.decode(config.solPrivateKey!);
    this.serviceWallet = Keypair.fromSecretKey(secretKeyUint8Array);
    this.stateAddress = new PublicKey(config.stateAddress);
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

  async getReferrerPublicKey(
    userPublicKey: PublicKey
  ): Promise<PublicKey | null> {
    try {
      // Calculate the PDA for the user account
      const [userAccountPDA] = this.calculatePDA(userPublicKey, "user");

      // Fetch the user account data
      const user = await User.fromAccountAddress(
        this.connection,
        userAccountPDA
      );

      return user.referrer;
    } catch (error) {
      console.error("Error in getUser:", error);
      throw error;
    }
  }

  public async callInitializeMerchant(
    userPublicKeyString: string,
    nftIdentifierArray: [string, number]
  ): Promise<string> {
    const userPublicKey = new PublicKey(userPublicKeyString);
    // Calculate the PDA for the user account
    const [userPda] = await calculatePDA(this.programId, userPublicKey, "user");

    // Calculate the PDA for the merchant account
    const [merchantPda] = await calculatePDA(
      this.programId,
      userPublicKey,
      "merchant"
    );

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

    const transaction = new Transaction().add(instruction);

    // Fetch a recent blockhash
    const recentBlockhash = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;

    // Add priority fee
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 100_000,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000,
    });

    transaction.add(modifyComputeUnits);
    transaction.add(addPriorityFee);

    transaction.sign(this.serviceWallet);

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.serviceWallet]
    );

    return signature;
  }

  public async callInitializeMerchantWithReferrer(
    userPublicKeyString: string,
    referrerPublicKeyString: string,
    nftIdentifierArray: [string, number]
  ): Promise<string> {
    const userPublicKey = new PublicKey(userPublicKeyString);
    const referrerPublicKey = new PublicKey(referrerPublicKeyString);
    // Calculate the PDA for the user account
    const [userPda] = await calculatePDA(this.programId, userPublicKey, "user");
    const [referrerPda] = await calculatePDA(
      this.programId,
      referrerPublicKey,
      "user"
    );

    // Calculate the PDA for the merchant account
    const [merchantPda] = await calculatePDA(
      this.programId,
      userPublicKey,
      "merchant"
    );

    const nftIdentifier: CnftIdentifier = {
      merkleTreeAddress: new PublicKey(nftIdentifierArray[0]),
      leafIndex: nftIdentifierArray[1],
    };

    const instruction = createInitializeMerchantWithReferrerInstruction(
      {
        merchantAccount: merchantPda,
        userAccount: userPda,
        userPubkey: userPublicKey,
        referrerAccount: referrerPda,
        referrer: referrerPublicKey,
        serviceWallet: this.serviceWallet.publicKey,
        state: this.stateAddress,
        systemProgram: SystemProgram.programId,
      },
      {
        nftIdentifier: nftIdentifier,
      }
    );

    const transaction = new Transaction().add(instruction);

    // Fetch a recent blockhash
    const recentBlockhash = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;

    // Add priority fee
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 100_000,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000,
    });

    transaction.add(modifyComputeUnits);
    transaction.add(addPriorityFee);

    transaction.sign(this.serviceWallet);

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.serviceWallet]
    );

    return signature;
  }

  public async fetchUsers(): Promise<number> {
    const userGpaBuilder = User.gpaBuilder(this.programId);
    userGpaBuilder.addFilter("isMerchant", false);
    const nonMerchantUserAccounts = await userGpaBuilder.run(this.connection);

    const merchantUserAccounts = await this.fetchMerchants();

    return nonMerchantUserAccounts.length + merchantUserAccounts;
  }

  public async fetchMerchants(): Promise<number> {
    const merchantGpaBuilder = User.gpaBuilder(this.programId);
    merchantGpaBuilder.addFilter("isMerchant", true);
    const merchantAccounts = await merchantGpaBuilder.run(this.connection);

    return merchantAccounts.length;
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
