/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'

/**
 * Arguments used to create {@link ProgramState}
 * @category Accounts
 * @category generated
 */
export type ProgramStateArgs = {
  usdcMint: web3.PublicKey
  transactionFeePercentage: number
  daoPubkey: web3.PublicKey
  onboardingServiceWalletPubkey: web3.PublicKey
  merchantIdServiceWalletPubkey: web3.PublicKey
  transactionServiceWalletPubkey: web3.PublicKey
  reviewServiceWalletPubkey: web3.PublicKey
  merchantCounter: number
}

export const programStateDiscriminator = [77, 209, 137, 229, 149, 67, 167, 230]
/**
 * Holds the data for the {@link ProgramState} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class ProgramState implements ProgramStateArgs {
  private constructor(
    readonly usdcMint: web3.PublicKey,
    readonly transactionFeePercentage: number,
    readonly daoPubkey: web3.PublicKey,
    readonly onboardingServiceWalletPubkey: web3.PublicKey,
    readonly merchantIdServiceWalletPubkey: web3.PublicKey,
    readonly transactionServiceWalletPubkey: web3.PublicKey,
    readonly reviewServiceWalletPubkey: web3.PublicKey,
    readonly merchantCounter: number
  ) {}

  /**
   * Creates a {@link ProgramState} instance from the provided args.
   */
  static fromArgs(args: ProgramStateArgs) {
    return new ProgramState(
      args.usdcMint,
      args.transactionFeePercentage,
      args.daoPubkey,
      args.onboardingServiceWalletPubkey,
      args.merchantIdServiceWalletPubkey,
      args.transactionServiceWalletPubkey,
      args.reviewServiceWalletPubkey,
      args.merchantCounter
    )
  }

  /**
   * Deserializes the {@link ProgramState} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [ProgramState, number] {
    return ProgramState.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ProgramState} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<ProgramState> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find ProgramState account at ${address}`)
    }
    return ProgramState.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      '8mDhNcko1rByfWLzVTuddx386JFwFnD3oDPWV2pzBckN'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, programStateBeet)
  }

  /**
   * Deserializes the {@link ProgramState} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [ProgramState, number] {
    return programStateBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link ProgramState} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return programStateBeet.serialize({
      accountDiscriminator: programStateDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ProgramState}
   */
  static get byteSize() {
    return programStateBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ProgramState} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      ProgramState.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link ProgramState} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === ProgramState.byteSize
  }

  /**
   * Returns a readable version of {@link ProgramState} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      usdcMint: this.usdcMint.toBase58(),
      transactionFeePercentage: this.transactionFeePercentage,
      daoPubkey: this.daoPubkey.toBase58(),
      onboardingServiceWalletPubkey:
        this.onboardingServiceWalletPubkey.toBase58(),
      merchantIdServiceWalletPubkey:
        this.merchantIdServiceWalletPubkey.toBase58(),
      transactionServiceWalletPubkey:
        this.transactionServiceWalletPubkey.toBase58(),
      reviewServiceWalletPubkey: this.reviewServiceWalletPubkey.toBase58(),
      merchantCounter: this.merchantCounter,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const programStateBeet = new beet.BeetStruct<
  ProgramState,
  ProgramStateArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['usdcMint', beetSolana.publicKey],
    ['transactionFeePercentage', beet.u8],
    ['daoPubkey', beetSolana.publicKey],
    ['onboardingServiceWalletPubkey', beetSolana.publicKey],
    ['merchantIdServiceWalletPubkey', beetSolana.publicKey],
    ['transactionServiceWalletPubkey', beetSolana.publicKey],
    ['reviewServiceWalletPubkey', beetSolana.publicKey],
    ['merchantCounter', beet.u32],
  ],
  ProgramState.fromArgs,
  'ProgramState'
)